'use strict'

class MyApp {
    constructor () {
        this.container = document.getElementById('container');
        this.wrapper = document.getElementsByClassName('wrapper');
        this.rightSide = document.getElementById('right-side');
        this.input = this.container.getElementsByTagName('input');
        this.popupTemplate = document.getElementsByClassName('popup-template')[0];
        this.continueButton = document.getElementById('continue');

        this.inputName = document.getElementById('name');
        this.inputEmail = document.getElementById('email');
        this.inputPassword = document.getElementById('password');
        this.inputAgeCheckBox = document.getElementById('age');

        this.activeForm;
        this.index = 0;

        this.changeForm(this.index);
        this.container.onclick = (e) => this.onContainerClick(e)
        this.continueButton.onclick = () => this.changeForm(this.index);

        this.inputName.oninput = () => this.validate(this.activeForm)
        this.inputEmail.oninput = () => this.validate(this.activeForm);
        this.inputPassword.oninput = () => this.validate(this.activeForm);
        this.inputAgeCheckBox.oninput = () => this.validate(this.activeForm);
    }
    changeForm(index) {
        this.activeForm = this.wrapper[index];
        if(this.activeForm.classList.contains('registration')) {
            this.validate(this.activeForm);
            this.showContinueButton(true);
        }
        this.hideAllForms();
        this.setActiveClass(this.wrapper[index])
        this.index += 1;
    }
    validate(form) {
        let inputsState = [];
        let inputArr = form.querySelectorAll('input');
        inputArr.forEach((current) => {
            if (current.type == 'text' || current.type == 'password') {
                inputsState.push({
                    element : current,
                    value : this.isElementValid(current)
                })
            } else if (current.type == 'checkbox') {
                inputsState.push({
                    element : current,
                    value : current.checked
                })
            }
        })
        this.checkInputValue(inputsState);
        let status = this.isAllInputCorrect(inputsState);
        if(status) {
            this.showContinueButton(false);
            this.continueButton.classList.add('active');
        } else {
            this.showContinueButton(true);
            this.continueButton.classList.remove('active');
        }
    }
    checkInputValue(inputsState) {
        inputsState.forEach((current) => {
            !current.value ? this.setError(current)
                    : current.element.classList.remove('error')
        })
    }
    setError(current) {
        current.element.classList.add('error');
        current.element.setAttribute('placeholder',this.setPlaceHolder(current) )
    }
    isAllInputCorrect(inputsState) {
        return inputsState.every(el => el.value)
    }
    hideAllForms() {
        let wrapperArr = Array.from(this.wrapper);
        wrapperArr.forEach((el) => el.classList.remove('active'));
    }
    onContainerClick(e) {
        let selectedElement = e.target;
        if (this.activeForm.classList.contains('registration') && e.target.type == 'button' && e.target.id !== 'continue' ) {
            this.resetClass(this.input);
            this.setActiveClass(selectedElement);
        } else if (e.target.tagName === 'INPUT' && e.target.type == 'button' && e.target.id !== 'continue') {
            this.resetClass(this.input);
            this.setActiveClass(selectedElement);
            this.showPopup();
            this.checkSelectedVarian(selectedElement);
            this.showContinueButton();
        }
    }
    resetClass(element) {
        let elementArr = Array.from(element)
        elementArr.forEach((el) => {
            if(el.type == 'button' && el.id !== 'continue') {
                el.classList.remove('active')
            }
        });
    }
    setActiveClass(element) {
        element.classList.add('active')
    }
    showPopup() {
        let leftSide = this.activeForm.children[0]
        leftSide.appendChild(this.popupTemplate);
        this.popupTemplate.style.display = 'flex';
    }
    checkSelectedVarian(selectedElement) {
        let activeForm = this.checkActiveForm();
        this.popupTemplate.innerHTML = 
                            selectedElement.name == 'А' ?  this.templateForVariantA(activeForm) 
                            : selectedElement.name == 'Б' ? this.templateForVariantB(activeForm)
                            : selectedElement.name == 'В' ? this.templateForVariantV(activeForm)
                            : null;                                
    }
    checkActiveForm() {
        return this.activeForm.classList.contains('form-1') ? 'form-1' 
               : this.activeForm.classList.contains('form-2') ? 'form-2'
               : this.activeForm.classList.contains('form-3') ? 'form-3'
               : null;
    }
    showContinueButton(disabledState) {
        this.replaceContinueButton();
        this.continueButton.style.display = 'flex';
        this.continueButton.disabled = disabledState
    }
    replaceContinueButton() {
        let content = this.activeForm.getElementsByClassName('content')[0];
        content.appendChild(this.continueButton);
    }
    isElementValid(element) {
        switch (element.name) {
            case 'name' : return /^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/.test(element.value)
            case 'email' : return /^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i.test(element.value);
            case 'password' : return /(?=^.{8,12}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/.test(element.value)
        }
    }
    setPlaceHolder(current) {
        switch(current.element.name) {
            case 'name' : return 'ведите свое имя'; 
            case 'email' : return 'Неверный формат email'; 
            case 'password' : return 'Придумайте новый пароль'; 
        }
    }
    templateForVariantA(activeForm) {
        let form1template = `<h1>25%</h1>
                    <h4>ЛЮДЕЙ ОБРАЩАЮТ ВНИМАНИЕ
                    НА A</h4>`
        let form2template = `<h1>47,6%</h1>
                    <h4>ПОЛЬЗОВАТЕЛЕЙ - ВАРИАНТ A</h4>`
        return activeForm === 'form-1' ? form1template 
             : activeForm === 'form-2' ? form2template 
             : null
    }
    templateForVariantB(activeForm) {
        let form1template = `<h1>30%</h1>
                            <h4>ЛЮДЕЙ ОБРАЩАЮТ ВНИМАНИЕ
                            НА Б</h4>`
        let form2template = `<h1>52,4%</h1>
                    <h4>ПОЛЬЗОВАТЕЛЕЙ - ВАРИАНТ Б</h4>`
        return activeForm === 'form-1' ? form1template 
             : activeForm === 'form-2' ? form2template 
             : null
    }
    templateForVariantV() {
        return `<h1>7%</h1>
                <h4>ЛЮДЕЙ ОБРАЩАЮТ ВНИМАНИЕ
                НА В</h4>`
    }
}

const myApp = new MyApp();