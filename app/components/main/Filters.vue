<template>
    <div class="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/30 p-8 mb-8">
        <div class="flex flex-col lg:flex-row items-end gap-6">

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow w-full">
                <div v-for="(list, key) in options" :key="key" class="space-y-2">

                    <div class="flex items-center gap-2 px-1">
                        <div class="w-1.5 h-3 bg-[#22C55E] rounded-full"></div>
                        <label class="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {{ labels[key] }}
                        </label>
                    </div>

                    <USelectMenu v-model="modelValue[key]" :items="list" multiple searchable placeholder="Все"
                        class="w-full" :uiMenu="{
                            rounded: 'rounded-2xl',
                            shadow: 'shadow-2xl',
                            option: {
                                rounded: 'rounded-lg',
                                active: 'bg-green-50 text-[#22C55E]',
                                selected: 'text-[#22C55E]'
                            }
                        }" :ui="{
                            rounded: 'rounded-2xl',
                            padding: { lg: 'px-5 py-3.5' },
                            color: {
                                white: {
                                    outline: 'ring-1 ring-gray-100 shadow-none hover:ring-[#22C55E] focus:ring-2 focus:ring-[#22C55E] transition-all bg-gray-50/50'
                                }
                            }
                        }">
                        <template #label>
                            <span v-if="modelValue[key].length" class="text-sm font-black text-[#22C55E] truncate">
                                Выбрано: {{ modelValue[key].length }}
                            </span>
                            <span v-else class="text-sm text-gray-400 font-bold opacity-60 italic">Все</span>
                        </template>

                        <template #option-selected="{ selected }">
                            <UIcon name="i-heroicons-check-circle-20-solid" class="w-5 h-5 text-[#22C55E]" />
                        </template>
                    </USelectMenu>
                </div>
            </div>

            <UButton icon="i-heroicons-arrow-path-20-solid" color="red" variant="soft" size="lg"
                class="rounded-2xl h-[58px] px-8 font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-red-50 active:scale-95 border-none shadow-sm"
                @click="$emit('reset')">
                Сброс
            </UButton>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    options: { type: Object, required: true },
    modelValue: { type: Object, required: true }
});

defineEmits(['update:modelValue', 'reset']);

const labels = {
    group: 'Номенклатура',
    country: 'Страна',
    junction: 'Стык КЗХ',
    sender: 'Отправитель'
};
</script>