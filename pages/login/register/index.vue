<!--
 * 登录、注册
 * @module login
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">
                        {{ isSegister ? "Sign up" : "Sign in" }}
                    </h1>
                    <p class="text-xs-center">
                        <nuxt-link v-if="isSegister" to="login"
                            >Have an account?</nuxt-link
                        >
                        <nuxt-link v-else to="register"
                            >Have no account?</nuxt-link
                        >
                    </p>

                    <ul class="error-messages">
                        <template v-for="(msgs, field) in errors">
                            <li v-for="(msg, i) in msgs" :key="i">{{field}} {{msg}}</li>
                        </template>
                    </ul>

                    <form @submit.prevent="onSubmit">
                        <fieldset
                            v-if="isSegister"
                            class="form-group"
                        >
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="Your Name"
                                v-model="user.username"
                                required
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="email"
                                placeholder="Email"
                                v-model="user.email"
                                required
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="password"
                                placeholder="Password"
                                v-model="user.password"
                                required
                                minlength="8"
                            />
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            {{
                                isSegister ? "Sign up" : "Sign in"
                            }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { login, register } from "@/apis/user";

const Cookie = process.client ? require('js-cookie') : undefined;

/* 
    152014958@163.com
    effort6zh
*/
export default {
    middleware: 'notAuthenticated',
    data() {
        return {
            user: {
                username: "",
                email: "",
                password: "",
            },
            errors: {},
        };
    },
    methods: {
        async onSubmit() {
            try {
                let { data } = this.isSegister ? await register({
                    user: this.user,
                }): await login({
                    user: this.user,
                });
                Cookie.remove('user');
                // 保存用户登录状态
                Cookie.set('user', data.user)
                this.$store.commit('setUser', data.user)
                this.$router.push("/");
            } catch (error) {
                this.errors = error.response.data.errors;
            }
        },
    },
    computed: {
        isSegister() {
            return this.$route.name === 'register';
        },
    },
};
</script>

<style scoped lang="less">
</style>
