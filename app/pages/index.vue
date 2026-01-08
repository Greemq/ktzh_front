<template>
    <ClientOnly>
        <div class="p-6 bg-[#f9fafb] space-y-6 text-gray-900 font-sans">
            <div class="flex justify-between items-center px-2">
                <div>
                    <h1 class="text-3xl font-black uppercase tracking-tighter text-gray-800">Мониторинг</h1>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Аналитическая панель
                        управления</p>
                </div>
                <div
                    class="bg-[#22C55E] text-white px-6 py-3 rounded-2xl shadow-lg shadow-green-200 flex items-center gap-4 transition-all">
                    <span class="text-[10px] font-black uppercase opacity-70 tracking-widest">Найдено записей:</span>
                    <span class="text-2xl font-black">{{ filteredData.length }}</span>
                </div>
            </div>

            <MainFilters v-model="activeFilters" :options="filterOptions" @reset="resetFilters" />

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="kpi in kpis" :key="kpi.label"
                    class="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all">
                    <div>
                        <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">{{ kpi.label }}</p>
                        <p class="text-2xl font-black text-gray-800 mt-1">{{ kpi.value }}</p>
                    </div>
                    <div :class="`p-3 rounded-xl ${kpi.bg} ${kpi.color}`">
                        <UIcon :name="kpi.icon" class="w-7 h-7" />
                    </div>
                </div>
            </div>

            <MainGraphs :records="filteredData" />

            <div class="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/40">
                <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
                    <h3 class="font-black text-gray-700 uppercase text-sm tracking-wider flex items-center gap-2">
                        <div class="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                        Реестр планов погрузки
                    </h3>
                    <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span class="text-[10px] text-gray-400 font-black uppercase">Строк на страницу:</span>
                        <select v-model="pageCount"
                            class="bg-transparent text-xs font-bold outline-none cursor-pointer text-green-600">
                            <option :value="10">10</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full text-left border-collapse">
                        <thead
                            class="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-100">
                            <tr>
                                <th v-for="col in columns" :key="col.key" class="px-8 py-5">{{ col.label }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 bg-white">
                            <tr v-for="(row, idx) in paginatedRows" :key="idx"
                                class="hover:bg-green-50/30 transition-all group">
                                <td class="px-8 py-5 text-sm font-bold text-gray-700 group-hover:text-[#22C55E]">{{
                                    row.plan_number }}</td>
                                <td class="px-8 py-5 text-sm text-gray-500 font-medium">{{ row.sender }}</td>
                                <td class="px-8 py-5 text-sm text-gray-500 font-medium italic">{{ row.country }}</td>
                                <td class="px-8 py-5 text-sm font-black text-gray-800 text-right">
                                    <span
                                        class="bg-gray-100 group-hover:bg-green-100 group-hover:text-green-700 px-3 py-1 rounded-lg transition-colors">{{
                                            row.tons }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="filteredData.length === 0" class="p-32 text-center">
                        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p class="text-gray-300 font-black uppercase tracking-widest text-xs">Данные отсутствуют</p>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div class="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        Страница <span class="text-[#22C55E]">{{ page }}</span> из {{ totalPages }}
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="page--" :disabled="page <= 1"
                            class="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:border-green-200 hover:text-green-600 transition-all shadow-sm">
                            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" /> Назад
                        </button>
                        <button @click="page++" :disabled="page >= totalPages"
                            class="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:border-green-200 hover:text-green-600 transition-all shadow-sm">
                            Вперед
                            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <template #fallback>
            <div class="h-screen w-full flex items-center justify-center bg-[#f9fafb]">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin">
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Синхронизация</span>
                </div>
            </div>
        </template>
    </ClientOnly>
</template>

<script setup>
definePageMeta({ layout: 'base-layout' })

const { data: allData } = await useFetch('/api/all-data')
const records = computed(() => (Array.isArray(allData.value) ? allData.value : []))

const INITIAL_FILTERS = { group: [], country: [], junction: [], sender: [] }
const page = ref(1)
const pageCount = ref(20)
const activeFilters = ref({ ...INITIAL_FILTERS })

const columns = [
    { key: 'plan_number', label: '№ Плана' },
    { key: 'sender', label: 'Отправитель' },
    { key: 'country', label: 'Страна' },
    { key: 'tons', label: 'Тонны (тн)' }
]

const filterOptions = computed(() => ({
    group: [...new Set(records.value.map(r => String(r['Номенклатурная группа'] || '')).filter(Boolean))],
    country: [...new Set(records.value.map(r => String(r['Страна назначения'] || '')).filter(Boolean))],
    junction: [...new Set(records.value.map(r => String(r['Выходной стык КЗХ'] || '')).filter(Boolean))],
    sender: [...new Set(records.value.map(r => String(r['Грузоотправитель'] || '')).filter(Boolean))]
}))

const filteredData = computed(() => {
    return records.value.filter(r => {
        const f = activeFilters.value
        return (f.group.length === 0 || f.group.includes(String(r['Номенклатурная группа']))) &&
            (f.country.length === 0 || f.country.includes(String(r['Страна назначения']))) &&
            (f.junction.length === 0 || f.junction.includes(String(r['Выходной стык КЗХ']))) &&
            (f.sender.length === 0 || f.sender.includes(String(r['Грузоотправитель'])))
    })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageCount.value) || 1)

const paginatedRows = computed(() => {
    const start = (page.value - 1) * pageCount.value
    return filteredData.value.slice(start, start + pageCount.value).map(r => ({
        plan_number: r['Номер плана'] || '-',
        sender: r['Грузоотправитель'] || '-',
        country: r['Страна назначения'] || '-',
        tons: Number(r['К-во тонн заявлено'] || 0).toLocaleString()
    }))
})

const kpis = computed(() => [
    { label: 'Всего тонн', value: filteredData.value.reduce((a, r) => a + Number(r['К-во тонн заявлено'] || 0), 0).toLocaleString(), icon: 'i-heroicons-scale', bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Всего вагонов', value: filteredData.value.reduce((a, r) => a + Number(r['К-во вагонов заявлено'] || 0), 0).toLocaleString(), icon: 'i-heroicons-truck', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Экспедиторы', value: new Set(filteredData.value.map(r => r['Экспедитор КЗХ'])).size, icon: 'i-heroicons-briefcase', bg: 'bg-lime-50', color: 'text-lime-600' },
    { label: 'Пункты назначения', value: new Set(filteredData.value.map(r => r['Станция назначения'])).size, icon: 'i-heroicons-map-pin', bg: 'bg-teal-50', color: 'text-teal-600' }
])

const resetFilters = () => {
    activeFilters.value = { ...INITIAL_FILTERS }
    page.value = 1
}

watch([activeFilters, pageCount], () => page.value = 1, { deep: true })
</script>