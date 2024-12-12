import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";

export class Form {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;
        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: "name",
                    id: "name",
                    element: null,
                    regex: /^[А-Я][а-яё]+\s*$/,
                    valid: false,
                },
                {
                    name: "lastName",
                    id: "last-name",
                    element: null,
                    regex: /^[А-Я][а-яё]+\s*$/,
                    valid: false,
                }
            )
        }

        const that = this;
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            item.element.addEventListener("change", function () {
                that.validateField.call(that, item, this);
            })
        });

        this.processElement = document.getElementById('process');
        this.processElement.addEventListener('click', function () {
            that.processForm()
        });


        if (that.page === 'signup') {
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.addEventListener('change', function () {
                that.validateForm()
            })
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute("style");
            field.valid = true;
        }
        this.validateForm();

    }


    validateForm() {
        const validForm = this.fields.every((item) => item.valid);
        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid

    }


    async processForm() {
        if (this.validateForm()) {

            if (this.page === 'signup') {
                try {

                    const result = await CustomHttp.request('http://localhost:3000/api/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value,
                        lastName: this.fields.find(item => item.name === 'lastName').element.value,
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.fields.find(item => item.name === 'password').element.value,
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }

                        location.href = '#/choice';
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {

                    const result = await CustomHttp.request('http://localhost:3000/api/login', 'POST', {
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.fields.find(item => item.name === 'password').element.value,
                    })

                    if (result) {
                        if (result.error || !result.accessToken || !result.refreshToken || !result.fullName || !result.userId) {
                            throw new Error(result.message);
                        }

                        Auth.setTokens(result.accessToken, result.refreshToken);
                        location.href = '#/choice';
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
}