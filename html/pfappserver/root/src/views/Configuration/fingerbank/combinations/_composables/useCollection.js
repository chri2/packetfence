import { computed, toRefs } from '@vue/composition-api'
import i18n from '@/utils/locale'

export const useItemProps = {
  id: {
    type: String
  },
  scope: {
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
        return i18n.t('Fingerbank Combination <code>{id}</code>', { id: id.value })
      case isClone.value:
        return i18n.t('Clone Fingerbank Combination <code>{id}</code>', { id: id.value })
      default:
        return i18n.t('New Fingerbank Combination')
    }
  })
}

export const useItemTitleBadge = props => props.scope

export { useRouter } from '../_router'

export const useStore = (props, context, form) => {
  const {
    id
  } = toRefs(props)
  const { root: { $store } = {} } = context
  return {
    isLoading: computed(() => $store.getters['$_fingerbank/isCombinationsLoading']),
    createItem: () => $store.dispatch('$_fingerbank/createCombination', form.value),
    deleteItem: () => $store.dispatch('$_fingerbank/deleteCombination', id.value),
    getItem: () => $store.dispatch('$_fingerbank/getCombination', id.value),
    updateItem: () => $store.dispatch('$_fingerbank/updateCombination', form.value),
  }
}

import { pfSearchConditionType as conditionType } from '@/globals/pfSearch'
import makeSearch from '@/views/Configuration/_store/factory/search'
import api from '../_api'
export const useSearch = makeSearch('fingerbankCombinations', {
  api,
  columns: [
    {
      key: 'selected',
      thStyle: 'width: 40px;', tdClass: 'p-0',
      locked: true
    },
    {
      key: 'id',
      label: 'Identifier', // i18n defer
      required: true,
      searchable: true,
      sortable: true,
      visible: true
    },
    {
      key: 'device_id',
      label: 'Device', // i18n defer
      searchable: true,
      sortable: true,
      visible: true
    },
    {
      key: 'score',
      label: 'Score', // i18n defer
      sortable: true,
      visible: true
    },
    {
      key: 'created_at',
      label: 'Created', // i18n defer
      sortable: true,
      visible: true
    },
    {
      key: 'updated_at',
      label: 'Updated', // i18n defer
      sortable: true,
      visible: true
    },
    {
      key: 'buttons',
      class: 'text-right p-0',
      locked: true
    }
  ],
  fields: [
    {
      value: 'id',
      text: i18n.t('Identifier'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'device_id',
      text: i18n.t('Device'),
      types: [conditionType.SUBSTRING]
    }
  ],
  sortBy: 'id',
  defaultCondition: () => ({ op: 'and', values: [
    { op: 'or', values: [
      { field: 'id', op: 'contains', value: null },
      { field: 'device_id', op: 'contains', value: null }
    ] }
  ] })
})
