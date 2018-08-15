/**
 * Memory diagnostics
 */

function getValue(id, datatype) {
  if (id < 8) {
    return [null, false, 0, "", undefined, true][id]
  }
  let mem = new Int32Array(machine._processes[0].instance.exports.memory.buffer)
  let mindex = machine._processes[0].instance.exports.getMindex()
  id -= 8
  let i = mindex + 8 * id

  let item = {}
  item.offset = Math.floor(mem[i / 4] / 8) * 8
  item.datatype = datatype || mem[i / 4] % 8
  item.len = mem[item.offset / 4 - 1]
  item.refs = mem[i / 4 + 1]
  switch (item.datatype) {
    case 0:
      return null
    case 1:
      return undefined
    case 2:
      return machine._processes[0].instance.exports.loadF64(item.offset)
    case 3:
      machine.pushFromMemory(item.offset, item.len)
      return machine._popString()
    case 4:
      let ar = []
      for (let i = item.offset; i < item.offset + item.len; i += 4) {
        ar.push(getValue(mem[i / 4]))
      }
      return ar
    case 5:
      let obj = {}
      for (let i = item.offset; i < item.offset + item.len; i += 8) {
        obj[getValue(mem[i / 4])] = getValue(mem[i / 4 + 1])
      }
      return obj
    case 6:
      machine.pushFromMemory(item.offset, item.len)
      return machine._popArrayBuffer()

    default:
      return undefined
  }
}

function validateAlloc() {
  let mem = new Int32Array(machine._processes[0].instance.exports.memory.buffer)
  let allocs = []
  let offset = 0
  let space = mem[offset / 4]
  while (offset < mem.length - 1) {
    let alloc = {}
    allocs.push(alloc)
    alloc.free = space
    offset += space
    if (space !== mem[offset / 4]) console.error("memory error at", offset)
    offset += 4
    space = mem[offset / 4]

    alloc.offset = offset + 4
    alloc.used = space
    offset += space + 4
    offset = Math.floor(offset / 8) * 8 + 8
    space = mem[offset / 4]
    space = Math.floor(space / 8) * 8
  }
  console.table(allocs)
}
function validateMindex() {
  let mem = new Int32Array(machine._processes[0].instance.exports.memory.buffer)
  let mindex = machine._processes[0].instance.exports.getMindex()
  let mindexLen = mem[mindex / 4 - 1]
  let id = 8
  let index = []
  for (let i = mindex; i < mindex + mindexLen; i += 8) {
    let item = {}
    index.push(item)
    item.offset = Math.floor(mem[i / 4] / 8) * 8
    //item.datatype = mem[i / 4] % 8
    item.refs = mem[i / 4 + 1]
    item.value = getValue(id++)
  }
  console.table(index)
}
function garbagecollect() {
  machine._processes[0].instance.exports.garbagecollect()
}
function traceGC() {
  machine._processes[0].instance.exports.traceGC()
}

setTimeout(() => {
  validateAlloc()
  validateMindex()
}, 1024);