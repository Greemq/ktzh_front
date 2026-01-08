<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div
            class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-500/5 relative overflow-hidden">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2.5 bg-green-50 rounded-2xl text-[#22C55E]">
                    <UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
                </div>
                <h3 class="font-black text-gray-800 uppercase text-[11px] tracking-[0.2em]">Потоки по странам</h3>
            </div>
            <div class="h-64">
                <Bar :data="countryData" :options="baseOptions" />
            </div>
        </div>

        <div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-500/5">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2.5 bg-green-50 rounded-2xl text-[#22C55E]">
                    <UIcon name="i-heroicons-truck" class="w-5 h-5" />
                </div>
                <h3 class="font-black text-gray-800 uppercase text-[11px] tracking-[0.2em]">Парк вагонов</h3>
            </div>
            <div class="h-64 relative">
                <Doughnut :data="wagonData" :options="doughnutOptions" />
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                    <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Всего</span>
                    <span class="text-3xl font-black text-gray-800 tracking-tighter">{{ totalWagons }}</span>
                </div>
            </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-green-500/5 lg:col-span-2">
            <div class="flex items-center gap-4 mb-8">
                <div class="p-3 bg-green-50 rounded-2xl text-[#22C55E]">
                    <UIcon name="i-heroicons-presentation-chart-line" class="w-6 h-6" />
                </div>
                <div>
                    <h3 class="font-black text-gray-800 uppercase text-xs tracking-[0.2em]">Лидеры погрузки</h3>
                    <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">Топ-15 компаний по объему вагонов</p>
                </div>
            </div>
            <div class="h-80 w-full">
                <Line :data="senderData" :options="lineOptions" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import {
    Chart as ChartJS, Title, Tooltip, Legend, BarElement,
    CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Filler
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Filler)

const props = defineProps(['records']);

const TTC_GREEN = '#22C55E';

// Новая палитра для Doughnut (разные цвета)
const CHART_COLORS = [
    '#6366f1', // Indigo
    '#f59e0b', // Amber
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
];

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    borderRadius: 8,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, grid: { color: '#f8fafc' }, ticks: { font: { size: 10, weight: '700' }, color: '#94a3b8' } },
        x: { grid: { display: false }, ticks: { font: { size: 10, weight: '700' }, color: '#64748b' } }
    }
};

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            cornerRadius: 12,
            titleFont: { weight: 'bold' }
        }
    },
    scales: {
        y: { beginAtZero: true, grid: { color: '#f8fafc' }, ticks: { font: { size: 10, weight: '700' }, color: '#94a3b8' } },
        x: { grid: { display: false }, ticks: { font: { size: 10, weight: '800' }, color: '#1e293b' } }
    }
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    spacing: 6,
    borderRadius: 20,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                font: { size: 11, weight: 'bold' },
                padding: 15,
                color: '#64748b'
            }
        }
    }
};

const aggregate = (arr, key, valKey, limit = 10) => {
    const stats = arr.reduce((acc, row) => {
        const label = row[key] || 'Прочие';
        acc[label] = (acc[label] || 0) + Number(row[valKey] || 0);
        return acc;
    }, {});
    return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, limit);
};

const totalWagons = computed(() => props.records.reduce((s, r) => s + Number(r['К-во вагонов заявлено'] || 0), 0).toLocaleString());

const countryData = computed(() => {
    const sorted = aggregate(props.records, 'Страна назначения', 'К-во тонн заявлено');
    return {
        labels: sorted.map(i => i[0]),
        datasets: [{
            data: sorted.map(i => i[1]),
            backgroundColor: TTC_GREEN,
            hoverBackgroundColor: '#16a34a'
        }]
    };
});

const wagonData = computed(() => {
    const sorted = aggregate(props.records, 'Род вагона', 'К-во вагонов заявлено', 5);
    return {
        labels: sorted.map(i => i[0]),
        datasets: [{
            data: sorted.map(i => i[1]),
            backgroundColor: CHART_COLORS, // Используем разноцветную палитру
            hoverOffset: 10,
            borderWidth: 0
        }]
    };
});

const senderData = computed(() => {
    const sorted = aggregate(props.records, 'Грузоотправитель', 'К-во вагонов заявлено', 15);
    return {
        labels: sorted.map(i => i[0]),
        datasets: [{
            label: 'Вагоны',
            data: sorted.map(i => i[1]),
            borderColor: TTC_GREEN,
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 2,
            pointBackgroundColor: TTC_GREEN,
        }]
    };
});
</script>