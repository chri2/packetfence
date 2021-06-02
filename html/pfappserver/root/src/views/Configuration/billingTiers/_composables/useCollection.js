import { computed, toRefs } from '@vue/composition-api'
import { pfSearchConditionType as conditionType } from '@/globals/pfSearch'
import i18n from '@/utils/locale'

export const useItemTitle = (props) => {
  const {
    id,
    isClone,
    isNew
  } = toRefs(props)
  return computed(() => {
    switch (true) {
      case !isNew.value && !isClone.value:
        return i18n.t('Billing Tier <code>{id}</code>', { id: id.value })
      case isClone.value:
        return i18n.t('Clone Billing Tier <code>{id}</code>', { id: id.value })
      default:
        return i18n.t('New Billing Tier')
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
    isLoading: computed(() => $store.getters['$_billing_tiers/isLoading']),
    getOptions: () => $store.dispatch('$_billing_tiers/options', id.value),
    createItem: () => $store.dispatch('$_billing_tiers/createBillingTier', form.value),
    deleteItem: () => $store.dispatch('$_billing_tiers/deleteBillingTier', id.value),
    getItem: () => $store.dispatch('$_billing_tiers/getBillingTier', id.value).then(item => {
      if (isClone.value) {
        item.id = `${item.id}-${i18n.t('copy')}`
        item.not_deletable = false
      }
      return item
    }),
    updateItem: () => $store.dispatch('$_billing_tiers/updateBillingTier', form.value)
  }
}

import makeSearch from '@/views/Configuration/_store/factory/search'
import api from '../_api'
export const useSearch = makeSearch('billingTiers', {
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
      sortable: true,
      visible: true,
      searchable: true
    },
    {
      key: 'name',
      label: 'Name', // i18n defer
      sortable: true,
      visible: true,
      searchable: true
    },
    {
      key: 'description',
      label: 'Description', // i18n defer
      sortable: true,
      visible: true,
      searchable: true
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
      value: 'description',
      text: i18n.t('Description'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'name',
      text: i18n.t('Name'),
      types: [conditionType.SUBSTRING]
    }
  ],
  sortBy: 'id',
  defaultCondition: () => ({ op: 'and', values: [
    { op: 'or', values: [
      { field: 'id', op: 'contains', value: null },
      { field: 'name', op: 'contains', value: null },
      { field: 'description', op: 'contains', value: null }
    ] }
  ] })
})
