<template>
    <draggable
        class="path-entries"
        v-model="entries"
        group="people"
        @start="drag=true"
        @end="drag=false"
        item-key="id">
        <template #item="{ element, index }">
            <div class="path-entry">
                {{ ++index }}
                <input type="text"
                    :value="element.value"
                    @change="updateIndex($event, index)"
                />
            </div>
        </template>


        <template #footer>
            <button @click="addEntry">Add</button>
        </template>
    </draggable>

    <textarea :value="output"></textarea>
</template>

<style scoped>
    .path-entries {

    }

    .path-entry {
        padding: 0.5em;
        border: 1px solid #ccc;
        border-bottom: 0;
    }
</style>



<script setup>
import draggable from 'vuedraggable'
import { computed, ref, onMounted } from 'vue'
import { lsGetItem, lsSetItem } from '@/helpers/storage.js'

const LABEL_ENTRIES = 'entries'

const entries = ref(lsGetItem(LABEL_ENTRIES) || [])



const output = computed(() => {
    return entries.value.map((el) => el.value.toString().trim()).join(';')
})


// onMounted(() => {
//     // entries.value =
// })


function updateIndex($e, index) {
    entries.value[index].value = $e.target.value

    saveEntries()
}


function addEntry() {
    const d = new Date()

    entries.value.push({ label: 'label', value: 'C:\\', id: d.getTime() })
    saveEntries()
}


function saveEntries() {
    lsSetItem(LABEL_ENTRIES, entries.value)
}


</script>
