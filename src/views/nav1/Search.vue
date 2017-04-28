<template>
    <div>
        <div class="search-input">
            <input type="text" v-model="name"   @keyup="get($event)" @keydown.enter="search()" @keydown.down="selectDown()" @keydown.up.prevent="selectUp()">
            <span class="search-reset" @click="clearInput()">&times;</span>
            <!-- <button class="search-btn" @click="search()">搜一下</button>-->
            <div class="search-select">
                <!-- transition-group也是vue2.0中的新特性,tag='ul'表示用ul包裹v-for出来的li -->
                <transition-group name="itemfade" tag="ul" class="out-in" mode="out-in" v-cloak>
                    <li v-for="(value,index) in myData" :class="{selectback:index==now}" class="search-select-option search-select-list" @mouseover="selectHover(index)" @click="selectClick(index)" :key="value">
                        {{value}}
                    </li>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">

    import axios from 'axios';
    /* import logoSelect from './logo-select.vue';*/
    export default {
        data: function() {
            return {
                myData:[],//用来接收ajax得到的数据
                name: '',//v-model绑定的输入框的value
                now: -1,
                hospital:'',
                searchIndex: 0,
            }
        },
        methods: {
            get: function(ev) {
                if (ev.keyCode == 38 || ev.keyCode == 40) {
                    return;
                }
                this.$http.get('http://17p01d9617.iask.in/api/hospitals?hospital='+ this.hospital+'&name='+this.name).then(function(res) {
                    let names=res.body.data;
                    console.log(names)
                    let  hiat=this;
                    for(var i=0;i<names.length; i++ ){
                        let datas=hiat.myData.length;
                        if(datas>10){
                            hiat.myData=[];
                        }else if(this.name=="") {
                            hiat.myData=[]
                        }else {
                            hiat.myData.push(names[i].name);
                            this.hospital=names[i].id;
                            console.log(this.hospital)
                            return
                        }
                    }
                });
            },
            selectDown: function() {
                this.now++;
                //到达最后一个时，再按下就回到第一个
                if (this.now == this.myData.length) {
                    this.now = 0;
                }
                this.name = this.myData[this.now];
            },
            selectUp: function() {
                this.now--;
                //同上
                if (this.now == -1) {
                    this.now = this.myData.length - 1;
                }
                this.name = this.myData[this.now];
            },
            search: function() {
                //打开对应的搜索界面
                 this.$emit('searchname', this.hospital);
                 console.log(this.hospital)
                console.log(this.name)
                this.myData = [];
            },
            selectHover: function(index) {
                this.now = index
            },
            selectClick: function(index) {
                this.name = this.myData[index];
                this.search();
            },
            clearInput: function() {
                this.$http.get('http://17p01d9617.iask.in/api/hospitals?name='+ this.name ).then(function(res) {
                    this.myData = [];
                    /* console.log( this.myData+1)*/
                });
            },
            getIndex: function(index) {
                this.searchIndex = index;
            }
        }
    }
</script>

<style type="text/css">
    .out-in{
        margin: 0;
    }
    .search-input {
        height: 45px;
        width: 600px;
        margin: 0 auto;
        margin-top: 10px;
        position: relative;
    }
    .search-input input {
        border: 1px solid #e4e4e4;
        box-sizing: border-box;
        width: 500px;
        height: 45px;
        font-size: 18px;
        float: left;
        padding-left: 10px;
        padding-right: 10px;
        overflow: hidden;
    }
    .search-btn {
        height: 45px;
        width: 100px;
        border: 1px solid mediumseagreen;
        background-color: mediumseagreen;
        color: white;
        font-size: 16px;
        font-weight: bold;
        float: left;
    }
    .search-btn {
        cursor: pointer
    }
    .search-select {
        position: absolute;
        top: 45px;
        width: 500px;
        box-sizing: border-box;
        z-index: 999;
    }
    .search-select li {
        border: 1px solid #d4d4d4;
    ;
        border-top: none;
        border-bottom: none;
        background-color: #fff;
        width: 100%
    }
    .search-select-option {
        box-sizing: border-box;
        padding: 7px 10px;
    }
    .selectback {
        background-color: #eee !important;
        cursor: pointer
    }
    input::-ms-clear {
        display: none
    }
    .search-reset {
        width: 21px;
        height: 21px;
        position: absolute;
        display: block;
        line-height: 21px;
        text-align: center;
        cursor: pointer;
        font-size: 20px;
        right: 110px;
        top: 12px
    }
    .search-select-list {
        transition: all 0.5s
    }
    .itemfade-enter,
    .itemfade-leave-active {
        opacity: 0;
    }
    .itemfade-leave-active {
        position: absolute;
    }
    .selectback {
        background-color: #eee !important;
        cursor: pointer
    }
    .search-select ul{margin:0;text-align: left; }
</style>