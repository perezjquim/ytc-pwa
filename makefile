MANIFEST_FILE=webapp/manifest.appcache

main: regen-manifest

regen-manifest:
	echo "CACHE MANIFEST" > $(MANIFEST_FILE)
	echo "#$(shell date)\n" >> $(MANIFEST_FILE)	
	find webapp ! '(' -name '*.appcache' ')' -type f | sed 's/webapp\///g' >> $(MANIFEST_FILE)
	printf "\nNETWORK:\n*\n\nFALLBACK:\n\n" >> $(MANIFEST_FILE)
	cat webapp/manifest.appcache

run-local:
	FLASK_APP=main.py flask run