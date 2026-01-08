<template>
    <div class="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-green-100">

        <header class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div class="max-w-[1440px] mx-auto px-6 h-16 flex justify-between items-center">

                <div class="flex items-center gap-3">
                    <div class="w-10 h-10  rounded-xl flex items-center justify-center ">
                        <span class="text-[#22C55E] font-black text-sm italic tracking-tighter">TTC</span>
                    </div>
                </div>

                <nav class="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                    <UButton to="/" variant="ghost"
                        class="font-black text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all"
                        active-class="bg-white text-[#22C55E] shadow-sm ring-1 ring-black/5"
                        inactive-class="text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                        Dashboard
                    </UButton>

                    <UButton to="/reports" variant="ghost"
                        class="font-black text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all"
                        active-class="bg-white text-[#22C55E] shadow-sm ring-1 ring-black/5"
                        inactive-class="text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                        Отчеты
                    </UButton>
                </nav>


            </div>
        </header>

        <main class="max-w-[1440px] mx-auto px-6 py-8">
            <slot />
        </main>

    </div>
</template>
<style>
html,
body {
    /* Убираем любые фиксации высоты */
    height: auto !important;
    min-height: 100%;
    /* Разрешаем скролл по вертикали принудительно */
    overflow-y: visible !important;
    margin: 0;
    padding: 0;
}
</style>