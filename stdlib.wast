(func $address_of (param $id i32) (result i32)
  (call $-number (f64.convert_u/i32 (call $-offset (get_local $id))))
)
(func $size_of (param $id i32) (result i32)
  (call $-number (f64.convert_u/i32 (call $-len (get_local $id))))
)


(func $read8 (param $id i32) (param $posId i32) (result i32)
  (call $-number (f64.convert_u/i32 (call $-read8 (get_local $id) (i32.trunc_u/f64 (call $-f64 (get_local $posId))) )))
)
(func $read16 (param $id i32) (param $posId i32) (result i32)
  (call $-number (f64.convert_u/i32 (call $-read16 (get_local $id) (i32.trunc_u/f64 (call $-f64 (get_local $posId))) )))
)
(func $read32 (param $id i32) (param $posId i32) (result i32)
  (call $-number (f64.convert_u/i32 (call $-read32 (get_local $id) (i32.trunc_u/f64 (call $-f64 (get_local $posId))) )))
)

(func $write8 (param $id i32) (param $posId i32) (param $dataId i32) (result i32)
  (local $data i32)
  (if (i32.lt_u (call $-datatype (get_local $dataId)) (i32.const 3))(then
    (set_local $data (i32.trunc_s/f64 (call $-f64 (call $-toNumber (get_local $dataId)))))
  )(else
    (set_local $data (call $-read8 (get_local $dataId) (i32.const 0)))
  ))
  (call $-write8 (get_local $id) (i32.trunc_u/f64 (call $-f64 (get_local $posId))) (get_local $data))
  (i32.const 0)
)
(func $write16 (param $id i32) (param $posId i32) (param $dataId i32) (result i32)
  (local $data i32)
  (if (i32.lt_u (call $-datatype (get_local $dataId)) (i32.const 3))(then
    (set_local $data (i32.trunc_s/f64 (call $-f64 (call $-toNumber (get_local $dataId)))))
  )(else
    (set_local $data (call $-read16 (get_local $dataId) (i32.const 0)))
  ))
  (call $-write16 (get_local $id) (i32.trunc_u/f64 (call $-f64 (get_local $posId))) (get_local $data))
  (i32.const 0)
)
(func $write32 (param $id i32) (param $posId i32) (param $dataId i32) (result i32)
  (local $data i32)
  (if (i32.lt_u (call $-datatype (get_local $dataId)) (i32.const 3))(then
    (set_local $data (i32.trunc_s/f64 (call $-f64 (call $-toNumber (get_local $dataId)))))
  )(else
    (set_local $data (call $-read32 (get_local $dataId) (i32.const 0)))
  ))
  (call $-write32 (get_local $id) (i32.trunc_u/f64 (call $-f64 (get_local $posId))) (get_local $data))
  (i32.const 0)
)
