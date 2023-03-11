<template>

    <table>
        <thead>
            <th>{{ props.name }}</th>
        </thead>

        <tbody>
            <tr v-for="(entry, index) in entries"
                :key="entry.id"
                class="path-entry"
            >
                <td>
                    <input type="text"
                        :value="entry?.value"
                        @change="updateIndex($event, index)"
                    />
                </td>

                <td>
                    <button @click="deleteEntry(index)">X</button>
                    <button :disabled="index === 0" @click="nudgeEntry(index, -1)">^</button>
                    <button :disabled="index === entries.length-1" @click="nudgeEntry(index, 1)">V</button>
                </td>

            </tr>
        </tbody>

        <tfoot>
            <button @click="addEntry">Add</button>
        </tfoot>
    </table>

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

import { defineProps, computed, ref, onMounted } from 'vue'
import { lsGetItem, lsSetItem } from '@/helpers/storage.js'

const props = defineProps({
    name: String,
})

const LABEL_ENTRIES = 'entries-' + props.name.trim().toLowerCase()

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


function deleteEntry(index) {
    const ents = entries.value
    delete ents[index]
    entries.value = ents.filter(el => el)
    saveEntries()
}


function nudgeEntry(index, direction) {
    let entry = Object.assign({}, entries.value[index])
    entries.value[index] = entries.value[index + direction]
    entries.value[index + direction] = entry

    // nudge
    saveEntries()
}


function saveEntries() {
    lsSetItem(LABEL_ENTRIES, entries.value)
}


</script>
