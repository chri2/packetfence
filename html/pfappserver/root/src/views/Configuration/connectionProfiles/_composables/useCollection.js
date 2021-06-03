import { computed, toRefs } from '@vue/composition-api'
import i18n from '@/utils/locale'

export const useItemProps = {
  id: {
    type: String
  }
}

export const useItemTitle = (props) => {
  const {
    id,
    isClone,
    isNew
  } = toRefs(props)
  return computed(() => {
    switch (true) {
      case !isNew.value && !isClone.value:
        return i18n.t('Standard Connection Profile <code>{id}</code>', { id: id.value })
      case isClone.value:
        return i18n.t('Clone Standard Connection Profile <code>{id}</code>', { id: id.value })
      default:
        return i18n.t('New Standard Connection Profile')
    }
  })
}

export { useRouter } from '../_router'

export const useStore = (props, context, form) => {
  const {
    id,
    isClone
  } = toRefs(props)
  const { root: { $store } = {} } = context
  return {
    isLoading: computed(() => $store.getters['$_connection_profiles/isLoading']),
    getOptions: () => $store.dispatch('$_connection_profiles/options', id.value),
    createItem: () => $store.dispatch('$_connection_profiles/createConnectionProfile', form.value),
    deleteItem: () => $store.dispatch('$_connection_profiles/deleteConnectionProfile', id.value),
    getItem: () => $store.dispatch('$_connection_profiles/getConnectionProfile', id.value).then(item => {
      const _item = JSON.parse(JSON.stringify(item))
      if (isClone.value) {
        _item.id = `${item.id}-${i18n.t('copy')}`
        _item.not_deletable = false
      }
      return _item
    }),
    updateItem: () => $store.dispatch('$_connection_profiles/updateConnectionProfile', form.value),
    sortItems: params => $store.dispatch('$_connection_profiles/sortConnectionProfiles', params)
  }
}

import { pfSearchConditionType as conditionType } from '@/globals/pfSearch'
import makeSearch from '@/views/Configuration/_store/factory/search'
import api from '../_api'
export const useSearch = makeSearch('connectionProfiles', {
  api,
  sortBy: null, // use natural order (sortable)
  columns: [ // output uses natural order (w/ sortable drag-drop), ensure NO columns are 'sortable: true'
    {
      key: 'selected',
      thStyle: 'width: 40px;', tdClass: 'p-0',
      locked: true
    },
    {
      key: 'status',
      label: 'Status', // i18n defer
      visible: true
    },
    {
      key: 'id',
      label: 'MAC', // i18n defer
      required: true,
      searchable: true,
      visible: true
    },
    {
      key: 'description',
      label: 'Description', // i18n defer
      searchable: true,
      visible: true
    },
    {
      key: 'buttons',
      class: 'text-right p-0',
      locked: true
    },
    {
      key: 'not_deletable',
      required: true,
      visible: false
    },
    {
      key: 'not_sortable',
      required: true,
      visible: false
    },
  ],
  fields: [
    {
      value: 'id',
      text: i18n.t('Identifier'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'description',
      text: i18n.t('Description'),
      types: [conditionType.SUBSTRING]
    }
  ],
  defaultCondition: () => ({ op: 'and', values: [
    { op: 'or', values: [
      { field: 'id', op: 'contains', value: null },
      { field: 'description', op: 'contains', value: null }
    ] }
  ] })
})
