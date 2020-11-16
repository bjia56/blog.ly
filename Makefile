
default:
	echo "Build not implemented yet"

pretty:
	prettier -w .

gen-api:
	openapi-generator-cli generate -i api/openapi.yaml -g nodejs-express-server -o .

serve-docs:
	redoc-cli serve -p 8001 -w api/openapi.yaml

render-docs:
	redoc-cli bundle api/openapi.yaml -o docs/openapi.html

lint-docs:
	openapi lint api/openapi.yaml

create-db:
	npm run create-db

.PHONY: pretty gen-api serve-docs render-docs lint-docs create-db