<!--
 * 
 * @module 
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div>
        <!-- top nav start -->
        <nav class="navbar navbar-light">
            <div class="container">
                <!-- <a class="navbar-brand" href="index.html">conduit</a> -->
                <nuxt-link class="navbar-brand" to="/" exact>conduit 部署测试</nuxt-link>
                <ul class="nav navbar-nav pull-xs-right">
                    <li class="nav-item">
                        <!-- Add "active" class when you're on that page" -->
                        <!-- <a class="nav-link active" href="">Home</a> -->
                        <nuxt-link class="nav-link" to="/" exact>
                            Home
                        </nuxt-link>
                    </li>
                    <template v-if="user">
                        <li class="nav-item">
                            <nuxt-link class="nav-link" to="/editor">
                                <i class="ion-compose"></i>&nbsp;New Post
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link class="nav-link" to="/settings">
                                <i class="ion-gear-a"></i>&nbsp;Settings
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link class="nav-link" :to="{
                                name: 'profile',
                                params: {
                                    username: user.username
                                }
                            }">
                                <img width="30" height="30" :src="user.image" style="border-radius: 50%;" />
                                its-wild
                            </nuxt-link>
                        </li>
                        <li class="nav-item" @click="logout">
                            <a class="nav-link" href="javascript:;">
                                logout
                            </a>
                        </li>
                    </template>

                    <template v-else>
                        <li class="nav-item">
                            <nuxt-link class="nav-link" to="/login">
                                Sign in
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link class="nav-link" to="/register">
                                Sign up
                            </nuxt-link>
                        </li>
                    </template>
                </ul>
            </div>
        </nav>
        <!-- top nav end -->

        <!-- child page start -->
        <nuxt-child />
        <!-- child page end -->

        <!-- bottom footer start -->
        <footer>
            <div class="container">
                <!-- <a href="/" class="logo-font">conduit</a> -->
                <nuxt-link class="logo-font" to="/" exact>conduit</nuxt-link>
                <span class="attribution">
                    An interactive learning project from
                    <a href="https://thinkster.io">Thinkster</a>. Code &amp;
                    design licensed under MIT.
                </span>
            </div>
        </footer>
        <!-- bottom footer end -->
    </div>
</template>

<script>
import { mapState } from "vuex";
const Cookie = process.client ? require('js-cookie') : undefined;

export default {
    data() {
        return {};
    },
    methods: {
        logout() {
            Cookie.remove('user');
            this.$store.commit("setUser", null);
            this.$router.push("/");
        }
    },
    computed: {
        ...mapState(["user"]),
    },
};
</script>

<style scoped lang="less">
</style>
