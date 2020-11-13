
default:
	echo "Build not implemented yet"

serve-docs:
	redoc-cli serve -p 8001 -w doc/api.yaml

render-docs:
	redoc-cli bundle doc/api.yaml -o doc/api.html

lint-docs:
	openapi lint doc/api.yaml

.PHONY: serve-docs render-docs lint-docs