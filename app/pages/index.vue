<template>
    <div class="flex flex-col h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

        <div class="p-6 space-y-6 flex flex-col flex-1 min-h-0">

            <header
                class="flex-none flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h1 class="text-2xl font-black uppercase tracking-tight text-slate-800 leading-none">Экспортный
                        отчет
                    </h1>
                </div>
                <button @click="refresh"
                    class="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-base font-semibold hover:bg-slate-700 transition flex items-center gap-2">
                    <span v-if="pending" class="animate-spin text-xl">↻</span>
                    <span>Обновить данные</span>
                </button>
            </header>

            <div class="flex-none grid grid-cols-2 md:grid-cols-5 gap-4">
                <button v-for="tab in tabsConfig" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'p-4 rounded-xl border transition-all duration-200 text-left shadow-sm',
                    activeTab === tab.id
                        ? `${tab.activeClass} border-transparent ring-2 ring-offset-2 ring-slate-400 scale-[1.01]`
                        : 'bg-white border-gray-200 hover:border-slate-300 opacity-80'
                ]">
                    <div class="text-xs font-bold uppercase tracking-wider mb-1"
                        :class="activeTab === tab.id ? 'text-white/80' : 'text-slate-400'">
                        Отчет {{ tab.id }}
                    </div>
                    <div class="text-base font-black truncate"
                        :class="activeTab === tab.id ? 'text-white' : 'text-slate-700'">
                        {{ tab.title }}
                    </div>
                </button>
            </div>

            <div v-if="pending"
                class="flex-1 flex items-center justify-center text-slate-400 animate-pulse bg-white rounded-2xl border border-gray-200 text-lg">
                Загрузка данных...
            </div>

            <div v-else-if="data"
                class="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 min-h-0 overflow-hidden">

                <div class="flex-none p-5 border-b border-gray-100 z-20" :class="currentHeader.bg">
                    <h2 class="font-bold text-base" :class="currentHeader.text">
                        {{ activeTab }}. {{ currentHeader.title }}
                    </h2>
                </div>

                <div class="flex-1 overflow-auto custom-scrollbar relative">

                    <table v-if="activeTab === 1" class="min-w-full border-separate border-spacing-0">
                        <thead class="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th
                                    class="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    Группа</th>
                                <th v-for="m in reportData.plans.months" :key="m"
                                    class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    {{ m }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="row in reportData.plans.rows" :key="row.name"
                                :class="row.name === 'ИТОГО' ? 'bg-blue-50 font-bold sticky bottom-0 z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : 'hover:bg-gray-50'">
                                <td class="px-4 py-3 text-sm text-slate-700 bg-inherit border-b border-gray-100">{{
                                    row.name }}</td>
                                <td v-for="m in reportData.plans.months" :key="m"
                                    class="px-4 py-3 text-sm text-right tabular-nums bg-inherit border-b border-gray-100">
                                    {{ fmt(row[m]) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table v-if="activeTab === 2" class="min-w-full border-separate border-spacing-0">
                        <thead class="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th
                                    class="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    Стык</th>
                                <th
                                    class="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    Группа</th>
                                <th v-for="m in reportData.mgsp.months" :key="m"
                                    class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    {{ m }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="(row, idx) in reportData.mgsp.rows" :key="idx" class="hover:bg-gray-50 text-sm">
                                <td class="px-4 py-3 font-medium text-slate-900 bg-inherit border-b border-gray-100">{{
                                    row.junction }}</td>
                                <td class="px-4 py-3 text-slate-500 bg-inherit border-b border-gray-100">{{ row.group }}
                                </td>
                                <td v-for="m in reportData.mgsp.months" :key="m"
                                    class="px-4 py-3 text-right tabular-nums bg-inherit border-b border-gray-100 font-bold text-indigo-600">
                                    {{ fmt(row[m]) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table v-if="activeTab >= 3" class="min-w-full border-separate border-spacing-0">
                        <thead class="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th
                                    class="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    НОД</th>
                                <th
                                    class="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    Станция</th>
                                <th
                                    class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    Вагоны</th>
                                <th
                                    class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase bg-slate-50 border-b border-gray-200">
                                    Тонны</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 text-sm">
                            <tr v-for="(row, i) in currentDetailedTabItems" :key="i" class="hover:bg-gray-50">
                                <td class="px-4 py-3 bg-inherit border-b border-gray-100">{{ row['НОД'] }}</td>
                                <td class="px-4 py-3 bg-inherit border-b border-gray-100">{{ row['Станция погрузки'] }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right font-bold tabular-nums text-slate-700 bg-inherit border-b border-gray-100">
                                    {{ fmt(row.wagons || row.wagon_sum) }}</td>
                                <td
                                    class="px-4 py-3 text-right tabular-nums bg-inherit border-b border-gray-100 text-slate-500">
                                    {{ fmt(row.tons || row.tonn_sum) }}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { data, pending, refresh } = await useFetch('/api/reports')

const activeTab = ref(1)

const tabsConfig = [
    { id: 1, title: 'Планы 3 страны', activeClass: 'bg-blue-600' },
    { id: 2, title: 'Экспорт МГСП', activeClass: 'bg-indigo-600' },
    { id: 3, title: 'Уголь (ЕТСНГ)', activeClass: 'bg-slate-800' },
    { id: 4, title: 'Ячмень (Актау)', activeClass: 'bg-orange-500' },
    { id: 5, title: 'Порты КЗХ', activeClass: 'bg-teal-600' },
]

// Вся логика заголовков вынесена сюда, чтобы избежать ошибок с кавычками в шаблоне
const currentHeader = computed(() => {
    const titles = {
        1: 'Планы 3 страны (вагоны)',
        2: 'Экспорт через МГСП (вагоны)',
        3: 'Уголь (детально)',
        4: 'Ячмень через Актау (детально)',
        5: 'Все грузы через порты'
    }
    const styles = {
        1: { bg: 'bg-blue-50/50', text: 'text-blue-800' },
        2: { bg: 'bg-indigo-50/50', text: 'text-indigo-800' },
        3: { bg: 'bg-slate-50', text: 'text-slate-800' },
        4: { bg: 'bg-orange-50', text: 'text-orange-800' },
        5: { bg: 'bg-teal-50', text: 'text-teal-800' }
    }
    return {
        title: titles[activeTab.value],
        bg: styles[activeTab.value].bg,
        text: styles[activeTab.value].text
    }
})

const currentDetailedTabItems = computed(() => {
    if (activeTab.value === 3) return data.value?.coal || []
    if (activeTab.value === 4) return data.value?.barley || []
    if (activeTab.value === 5) return data.value?.ports || []
    return []
})

const fmt = (v) => v ? Number(v).toLocaleString('ru-RU') : '0'

const reportData = computed(() => {
    if (!data.value) return { plans: { months: [], rows: [] }, mgsp: { months: [], rows: [] } }

    // Логика Планов
    const pMonths = [...new Set(data.value.plans.map(p => p.month_label))]
    const pGroups = {}
    data.value.plans.forEach(item => {
        if (!pGroups[item.group_name]) {
            pGroups[item.group_name] = { name: item.group_name }
            pMonths.forEach(m => pGroups[item.group_name][m] = 0)
        }
        pGroups[item.group_name][item.month_label] = Number(item.wagon_sum)
    })
    const pRows = Object.values(pGroups)
    const pTotals = { name: 'ИТОГО' }
    pMonths.forEach(m => pTotals[m] = pRows.reduce((s, r) => s + (r[m] || 0), 0))

    // Логика МГСП
    const mMonths = [...new Set(data.value.mgsp.map(p => p.month_label))]
    const mPivoted = {}
    data.value.mgsp.forEach(item => {
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

<style scoped>
/* Отключаем скролл у body на уровне браузера */
:global(html, body) {
    height: 100%;
    overflow: hidden;
}

/* Красивый тонкий скроллбар */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Фиксация шапок (Sticky Header) */
th {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>