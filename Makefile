
build: components lib/index.js lib/annotation.js annotate.css
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean
