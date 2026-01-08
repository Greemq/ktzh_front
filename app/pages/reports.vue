<template>
    <div
        class="space-y-6 text-slate-900 font-sans max-w-[1440px] mx-auto h-[calc(100vh-120px)] flex flex-col overflow-hidden">

        <div class="flex-none grid grid-cols-2 md:grid-cols-5 gap-4">
            <button v-for="tab in tabsConfig" :key="tab.id" @click="activeTab = tab.id" :class="[
                'p-5 rounded-[1.5rem] border transition-all duration-300 text-left relative overflow-hidden group',
                activeTab === tab.id
                    ? `${tabStlyes[tab.color].active} border-transparent shadow-md scale-[1.02] z-10`
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
            ]">
                <div class="text-[9px] font-black uppercase tracking-[0.2em] mb-2 transition-colors"
                    :class="activeTab === tab.id ? `${tabStlyes[tab.color].textTab} opacity-80` : 'text-slate-400'">
                    Вариант 0{{ tab.id }}
                </div>
                <div class="text-sm font-black truncate tracking-tight transition-colors"
                    :class="activeTab === tab.id ? tabStlyes[tab.color].textTab : 'text-slate-900'">
                    {{ tab.title }}
                </div>
            </button>
        </div>

        <div v-if="data"
            class="flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden min-h-0">

            <div class="flex-none p-6 border-b border-slate-50 flex items-center justify-between transition-colors duration-500"
                :class="tabStlyes[activeTabConfig.color].header">
                <div class="flex items-center gap-3">
                    <div
                        :class="['w-2 h-6 rounded-full transition-colors duration-500', tabStlyes[activeTabConfig.color].accent]">
                    </div>
                    <h2 class="font-black text-sm uppercase tracking-wider text-slate-800">
                        {{ activeTab }}. {{ activeTabConfig.title }}
                    </h2>
                </div>
            </div>

            <div class="flex-1 overflow-auto custom-scrollbar relative px-2 pb-2">
                <table v-if="activeTab === 1" class="min-w-full border-separate border-spacing-0">
                    <thead class="sticky top-0 z-10 bg-white/95 backdrop-blur-md">
                        <tr>
                            <th
                                class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                Группа</th>
                            <th v-for="m in reportData.plans.months" :key="m"
                                class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                {{ m }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in reportData.plans.rows" :key="row.name"
                            :class="row.name === 'ИТОГО' ? 'bg-blue-50/60 font-black sticky bottom-0 z-10' : 'hover:bg-slate-50 transition-colors'">
                            <td class="px-8 py-4 text-sm font-bold text-slate-700">{{ row.name }}</td>
                            <td v-for="m in reportData.plans.months" :key="m"
                                class="px-8 py-4 text-sm text-right font-medium tabular-nums text-slate-600 italic">
                                {{ fmt(row[m]) }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table v-if="activeTab === 2" class="min-w-full border-separate border-spacing-0">
                    <thead class="sticky top-0 z-10 bg-white/95 backdrop-blur-md">
                        <tr>
                            <th
                                class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                Стык</th>
                            <th
                                class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                Группа</th>
                            <th v-for="m in reportData.mgsp.months" :key="m"
                                class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                {{ m }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in reportData.mgsp.rows" :key="idx" class="hover:bg-slate-50">
                            <td class="px-8 py-4 text-sm font-bold text-slate-800">{{ row.junction }}</td>
                            <td class="px-8 py-4 text-sm text-slate-500 font-medium">{{ row.group }}</td>
                            <td v-for="m in reportData.mgsp.months" :key="m"
                                class="px-8 py-4 text-right tabular-nums font-black text-indigo-500">
                                {{ fmt(row[m]) }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table v-if="activeTab >= 3" class="min-w-full border-separate border-spacing-0">
                    <thead class="sticky top-0 z-10 bg-white/95 backdrop-blur-md">
                        <tr>
                            <th
                                class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                НОД</th>
                            <th
                                class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                Станция</th>
                            <th
                                class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                Вагоны</th>
                            <th
                                class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                Тонны</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in currentDetailedTabItems" :key="i" class="hover:bg-slate-50">
                            <td class="px-8 py-4 text-sm font-bold text-slate-700">{{ row['НОД'] }}</td>
                            <td class="px-8 py-4 text-sm text-slate-500 font-medium">{{ row['Станция погрузки'] }}</td>
                            <td class="px-8 py-4 text-right font-black tabular-nums text-emerald-600">{{ fmt(row.wagons
                                || row.wagon_sum) }}</td>
                            <td class="px-8 py-4 text-right text-sm tabular-nums text-slate-400 italic">{{ fmt(row.tons
                                || row.tonn_sum) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'base-layout' })
const { data, pending } = await useFetch('/api/reports')

const activeTab = ref(1)

// Обновленные бледные стили (Soft Palette)
const tabStlyes = {
    blue: {
        active: 'bg-blue-50/80 border-blue-200',
        header: 'bg-blue-50/30',
        accent: 'bg-blue-400',
        textTab: 'text-blue-700'
    },
    indigo: {
        active: 'bg-indigo-50/80 border-indigo-200',
        header: 'bg-indigo-50/30',
        accent: 'bg-indigo-400',
        textTab: 'text-indigo-700'
    },
    slate: {
        active: 'bg-slate-100 border-slate-300',
        header: 'bg-slate-50',
        accent: 'bg-slate-400',
        textTab: 'text-slate-700'
    },
    orange: {
        active: 'bg-orange-50/80 border-orange-200',
        header: 'bg-orange-50/30',
        accent: 'bg-orange-400',
        textTab: 'text-orange-700'
    },
    teal: {
        active: 'bg-teal-50/80 border-teal-200',
        header: 'bg-teal-50/30',
        accent: 'bg-teal-400',
        textTab: 'text-teal-700'
    }
}

const tabsConfig = [
    { id: 1, title: 'Планы 3 страны', color: 'blue' },
    { id: 2, title: 'Экспорт МГСП', color: 'indigo' },
    { id: 3, title: 'Уголь (ЕТСНГ)', color: 'slate' },
    { id: 4, title: 'Ячмень (Актау)', color: 'orange' },
    { id: 5, title: 'Порты КЗХ', color: 'teal' },
]

const activeTabConfig = computed(() => {
    const tab = tabsConfig.find(t => t.id === activeTab.value)
    const titles = {
        1: 'Планы 3 страны (вагоны)',
        2: 'Экспорт через МГСП (вагоны)',
        3: 'Уголь (детально)',
        4: 'Ячмень через Актау (детально)',
        5: 'Все грузы через порты'
    }
    return { ...tab, title: titles[activeTab.value] }
})

const currentDetailedTabItems = computed(() => {
    if (!data.value) return []
    if (activeTab.value === 3) return data.value.coal || []
    if (activeTab.value === 4) return data.value.barley || []
    if (activeTab.value === 5) return data.value.ports || []
    return []
})

const fmt = (v) => v ? Number(v).toLocaleString('ru-RU') : '0'

const reportData = computed(() => {
    const defaultData = { plans: { months: [], rows: [] }, mgsp: { months: [], rows: [] } }
    if (!data.value) return defaultData

    // 1. Обработка Планов
    const pMonths = [...new Set(data.value.plans?.map(p => p.month_label) || [])]
    const pGroups = {}
    data.value.plans?.forEach(item => {
        if (!pGroups[item.group_name]) {
            pGroups[item.group_name] = { name: item.group_name }
            pMonths.forEach(m => pGroups[item.group_name][m] = 0)
        }
        pGroups[item.group_name][item.month_label] = Number(item.wagon_sum)
    })
    const pRows = Object.values(pGroups)
    const pTotals = { name: 'ИТОГО' }
    pMonths.forEach(m => pTotals[m] = pRows.reduce((s, r) => s + (r[m] || 0), 0))

    // 2. Исправленная логика МГСП (Чтобы данные появились во втором табе)
    const mMonths = [...new Set(data.value.mgsp?.map(p => p.month_label) || [])]
    const mPivoted = {}
    data.value.mgsp?.forEach(item => {
        const key = `${item.junction}|${item.group_name}`
        if (!mPivoted[key]) {
            mPivoted[key] = { junction: item.junction, group: item.group_name }
            mMonths.forEach(m => mPivoted[key][m] = 0)
        }
        mPivoted[key][item.month_label] = Number(item.wagons)
    })

    return {
        plans: { months: pMonths, rows: [...pRows, pTotals] },
        mgsp: { months: mMonths, rows: Object.values(mPivoted) }
    }
})
</script>