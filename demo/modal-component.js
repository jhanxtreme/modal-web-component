;(function(document){
    'use strict';

    class ModalComponent extends HTMLElement {

        constructor(){
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open'});
            this._template = `
                <style>
                    :host {
                        position: relative;
                    }
                    *, *::after, *::before{
                        box-sizing: border-box;
                    }
                    .modal{
                        overflow: auto;
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        background-color: rgba(0,0,0, 0.5);
                        display: none;
                        overflow-x: hidden;
                    }
                    .modal.active{
                        display: block;
                    }
                    .inner{
                        position: relative;
                        width: 60%;
                        background-color: #fff;
                        border-radius: 4px;
                        margin: 3% auto;
                    }
                    .header{
                        position: relative;
                        top: 0;
                        padding: 1.5em; 
                        border-bottom: 1px #ddd solid;
                        width: 100%;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .body{
                        position: relative;
                        padding: 1em 0;
                    }
                    .footer{
                        position: relative;
                        bottom: 0;
                        padding: 1em; 
                        border-top: 1px #ddd solid;
                        width: 100%;
                        text-align: right;
                    }
                    .btn {
                        border: 1px #ddd solid;
                        padding: 0.8em 1.5em;
                        border-radius: 3px;
                        background-color: #fff;
                        cursor: pointer;
                    }
                    .fadeInDown{
                        animation-name: fadeInDown;
                        animation-duration: .35s;
                        animation-fill-mode: both;
                    }
                    @keyframes fadeInDown {
                        0%{
                            opacity: 0;
                            transform: translateY(-5%);
                        }
                        100%{
                            opacity: 1;
                            transform: translateY(0%);
                        }
                    }
                    @media (max-width: 500px) {
                        .inner{
                            width: 100% !important;
                        }
                    }
                </style>
                <div class="modal">
                    <div class="inner fadeInDown">
                        <div class="header">HEADER</div>
                        <div class="body"><slot></slot></div>
                        <div class="footer">
                            <button class="btn close">Close</button>
                        </div>
                    </div>
                </div>
            `;
        }

        static get observedAttributes(){
            return ['show', 'title', 'width'];
        }

        isDefined(param){
            return (param && param.value && param.value.length > 0) ? true : false;
        }

        update(){

            //inline css dimensions
            let inlinestyle = '';
            if(this.isDefined(this.attributes['width'])){
                inlinestyle += 'width:' + this.attributes['width'].value + ';';
            }
            if(inlinestyle.length > 0){
                this._shadowRoot.querySelector('.inner').setAttribute('style', inlinestyle);
            }

            //header text
            if(this.isDefined(this.attributes.title)){
                this._shadowRoot.querySelector('.header').innerHTML = this.attributes.title.value;
            }
        }

        attachEvents(){
            this._shadowRoot.querySelector('.btn.close').addEventListener('click', (e)=>{
                this.classNameToggle(this._shadowRoot.querySelector('.modal'), 'active', 'false');
                e.preventDefault();
            });

            this._shadowRoot.querySelector('.modal').addEventListener('click', (e)=>{
                if(e.target.className.indexOf('modal') > -1){
                   this.classNameToggle(this._shadowRoot.querySelector('.modal'), 'active', 'false');
                }
                e.preventDefault();
            });
        }

        connectedCallback(){
            this._shadowRoot.innerHTML = this._template;

            this.attachEvents();

            this.update();
        }

        attributeChangedCallback(name, oldVal, newVal){
            if(!this._shadowRoot.querySelector('.modal')) return;
            if(name === 'show'){
                this.classNameToggle(this._shadowRoot.querySelector('.modal'), 'active', newVal);
            }
        }

        classNameToggle(elem, name, value) {
            if([true, 'true'].indexOf(value) > 0){
                if(elem.className.indexOf(name) < 0){
                    let tmp = elem.className.split(' ');
                    tmp.push(name);
                    elem.className = tmp.join(' ');
                }
            }else if([false, 'false'].indexOf(value) > 0){
                elem.className = elem.className.split(' ').filter(c => c !== name);
            }
        }

    }

    customElements.define('modal-component', ModalComponent);

})(document);