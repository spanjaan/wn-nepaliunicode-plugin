/**
 * UnicodeConverter
 * Handles:
 *  - Input typing and font selection
 *  - Copy / Clear buttons
 *  - Server conversion (via Snowboard)
 *  - Smooth output updates (no flicker)
 */
class UnicodeConverter {
    /**
     * @param {HTMLElement} parent - Root element for the component
     */
    constructor(parent) {
        if (!parent) {
            console.error('Parent element not found');
            return;
        }

        this.parent = parent;

        // DOM references
        this.form = parent.querySelector('#unicodeForm');
        this.textarea = parent.querySelector('#inputText');
        this.output = parent.querySelector('#unicodeResult');
        this.copyBtn = parent.querySelector('#copyUnicode');
        this.clearBtn = parent.querySelector('#clearInput');
        this.inputFont = parent.querySelector('#inputFont');
        this.outputFont = parent.querySelector('#outputFont');
        this.inputLabel = parent.querySelector('#inputLabel');
        this.outputLabel = parent.querySelector('label[for="unicodeResult"]');

        // Validate essential elements
        if (!this.form || !this.textarea || !this.output || !this.inputFont || !this.outputFont) {
            console.error('Required elements missing:', {
                form: !!this.form,
                textarea: !!this.textarea,
                output: !!this.output,
                inputFont: !!this.inputFont,
                outputFont: !!this.outputFont,
            });
            return;
        }

        // Optional: Debounce typing timeout
        this.typingTimeout = null;

        // Bind handlers once (for add/remove consistency)
        this.clickHandler = this.clickHandler.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.ajaxUpdateHandler = this.ajaxUpdateHandler.bind(this);

        // Event bindings
        this.parent.addEventListener('click', this.clickHandler);
        this.parent.addEventListener('change', this.clickHandler);
        this.parent.addEventListener('submit', this.clickHandler);
        this.textarea.addEventListener('input', this.inputHandler);
        document.addEventListener('ajaxUpdate', this.ajaxUpdateHandler, true);

        // Initial setup
        this.setInputFont();
        this.setOutputFont();

        // Track last known font selections
        this.prevInputFont = this.inputFont.value;
        this.prevOutputFont = this.outputFont.value;

        // Wait until fonts load, then show output cleanly
        document.fonts.ready.then(() => {
            this.output.style.opacity = '1';
            this.setOutputFont();
        });
    }

    /**
     * Handle all delegated clicks, changes, and submits.
     * Uses [data-unicode-handler] attributes.
     */
    clickHandler(event) {
        const target = event.target.closest('[data-unicode-handler]');
        if (!target) return;

        // Ignore clicks that open dropdowns
        if (target.matches('select') && event.type === 'click') return;

        // Prevent form submit except explicit submit event
        if (target.tagName === 'FORM' && event.type !== 'submit') return;

        const method = target.dataset.unicodeHandler;
        if (!this[method]) return;

        event.preventDefault();

        // Skip disabled buttons or selects
        if (target.classList.contains('disabled') || target.disabled) return;

        try {
            // Only trigger onChange if actual value changed
            if (method === 'onChangeInputFont') {
                const newVal = this.inputFont.value;
                if (newVal !== this.prevInputFont) {
                    this.prevInputFont = newVal;
                    this[method](target);
                }
            } else if (method === 'onChangeOutputFont') {
                const newVal = this.outputFont.value;
                if (newVal !== this.prevOutputFont) {
                    this.prevOutputFont = newVal;
                    this[method](target);
                }
            } else {
                this[method](target);
            }
        } catch (error) {
            this.handleError(error, [target]);
        }
    }

    /**
     * Debounced input handler — avoids overloading server while typing.
     */
    inputHandler() {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => this.onConvert(), 300);
    }

    /**
     * Prevent Snowboard from directly replacing our output area.
     */
    ajaxUpdateHandler(event) {
        const targetId = event.detail?.target?.id || event.target?.id;
        if (targetId === 'unicodeResult') {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * Smoothly update output without flicker.
     * @param {string} content
     */
    updateOutput(content) {
        if (typeof content !== 'string') {
            this.handleError(new Error('Content must be a string'), [this.output]);
            return;
        }

        if (this.output.value === content) return;
        requestAnimationFrame(() => (this.output.value = content));
    }

    /**
     * Update input font style and placeholder.
     */
    setInputFont() {
        if (!this.textarea || !this.inputLabel) return;

        this.textarea.classList.remove('font-preeti', 'font-hisab');
        if (this.inputFont.value === 'preeti') {
            this.textarea.classList.add('font-preeti');
            this.textarea.placeholder = "k|Llt kmG6df 6fOk ug'{xf]; .";
            this.inputLabel.textContent = "Preeti Text";
        } else {
            this.textarea.classList.add('font-hisab');
            this.textarea.placeholder = "lx;fa kmG^df ^fOk ug'{xf]; .";
            this.inputLabel.textContent = "Hisab Text";
        }
    }

    /**
     * Update output font and label.
     */
    setOutputFont(target = this.output) {
        if (!target || !this.outputLabel) return;

        target.classList.remove('font-preeti', 'font-hisab', 'font-unicode');

        if (this.outputFont.value === 'preeti') {
            target.classList.add('font-preeti');
            target.placeholder = "k|Llt cfp6k'6 oxfF b]vLg] 5 .";
            this.outputLabel.textContent = "Preeti Output";
        } else if (this.outputFont.value === 'hisab') {
            target.classList.add('font-hisab');
            target.placeholder = "lx;fa cfp^k'^ oxfF b]lvg] % .";
            this.outputLabel.textContent = "Hisab Output";
        } else {
            target.classList.add('font-unicode');
            target.placeholder = "युनिकोड आउटपुट यहाँ देखिने छ ।";
            this.outputLabel.textContent = "Unicode Output";
        }
    }

    /**
     * Create a simple Bootstrap-style alert.
     */
    createAlert(type, content) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = content;
        return alert;
    }

    /**
     * Centralized error handler.
     */
    handleError(error, elements) {
        const errorMessage = error.response
            ? error.response.message
            : error.message || 'An error occurred';

        const alert = this.createAlert('danger', errorMessage);
        const existingAlert = this.form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.replaceWith(alert);
        } else {
            this.form.insertBefore(alert, this.form.firstChild);
        }

        setTimeout(() => alert.remove(), 5000);
        console.error('Error handled:', errorMessage);
    }

    /**
     * Call WinterCMS / Snowboard handler.
     * @param {string} method
     * @param {object} data
     * @returns {Promise}
     */
    callWinter(method, data) {
        if (typeof Snowboard === 'undefined') {
            this.handleError(new Error('Snowboard library not found'), [this.form]);
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            Snowboard.request(this.parent, method, {
                data,
                success: (response) => {
                    const responseData = response['#unicodeResult'];
                    if (responseData && typeof responseData === 'object' && 'value' in responseData) {
                        const content = String(responseData.value || '');
                        this.updateOutput(content);
                    } else {
                        this.handleError(
                            new Error('Invalid AJAX response format for #unicodeResult'),
                            [this.output]
                        );
                    }
                    resolve({ data: response, snowboard: this });
                },
                error: (response) => {
                    const msg =
                        response.responseJSON?.message ||
                        response.responseText ||
                        'Unknown AJAX error';
                    this.handleError(new Error(msg), [this.output]);
                    reject({ response, snowboard: this });
                },
            });
        });
    }

    async onChangeInputFont() {
        this.setInputFont();
        try {
            await this.callWinter('onConvert', {
                input_text: this.textarea.value,
                input_font: this.inputFont.value,
                output_font: this.outputFont.value,
            });
        } catch (error) {
            this.handleError(error, [this.inputFont]);
        }
    }

    async onChangeOutputFont() {
        this.output.classList.add('fading');
        await new Promise((resolve) => setTimeout(resolve, 250));

        this.setOutputFont();

        try {
            await this.callWinter('onConvert', {
                input_text: this.textarea.value,
                input_font: this.inputFont.value,
                output_font: this.outputFont.value,
            });

            await document.fonts.ready;
            await new Promise((resolve) => requestAnimationFrame(resolve));
            this.output.classList.remove('fading');
        } catch (error) {
            this.handleError(error, [this.outputFont]);
            this.output.classList.remove('fading');
        }
    }

    async onConvert() {
        try {
            await this.callWinter('onConvert', {
                input_text: this.textarea.value,
                input_font: this.inputFont.value,
                output_font: this.outputFont.value,
            });
        } catch (error) {
            this.handleError(error, [this.form]);
        }
    }

    async onCopy(target) {
        if (!this.output.value.trim()) return;

        try {
            await navigator.clipboard.writeText(this.output.value);
        } catch {
            this.output.select();
            document.execCommand('copy');
        }

        target.innerHTML = '<i class="bx bx-check-circle" aria-hidden="true"></i> Copied!';
        target.classList.add('text-green-600');

        setTimeout(() => {
            target.innerHTML = '<i class="bx bx-clipboard" aria-hidden="true"></i> Copy';
            target.classList.remove('text-green-600');
        }, 1500);
    }

    async onClear() {
        this.textarea.value = '';
        this.textarea.focus();

        try {
            await this.callWinter('onConvert', {
                input_text: '',
                input_font: this.inputFont.value,
                output_font: this.outputFont.value,
            });
        } catch (error) {
            this.handleError(error, [this.clearBtn]);
        }
    }
}

/**
 * Initialize converter on page load
 */
function onDOMContentLoaded() {
    document.querySelectorAll('[data-unicode-converter]').forEach((el) => {
        new UnicodeConverter(el);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    onDOMContentLoaded();
}
