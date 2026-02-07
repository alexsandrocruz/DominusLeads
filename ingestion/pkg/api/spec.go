package api

func SwaggetSpec() []byte {
	spec, _ := rawSpec()
	return spec
}
