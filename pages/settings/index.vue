<!--
 * 设置
 * @module settings
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <form @submit.prevent="formSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="URL of profile picture"
                                    required
                                    v-model="formData.image"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    v-model="formData.username"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    class="form-control form-control-lg"
                                    rows="8"
                                    placeholder="Short bio about you"
                                    required
                                    v-model="formData.bio"
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Email"
                                    required
                                    v-model="formData.email"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    v-model="formData.password"
                                />
                            </fieldset>
                            <button
                                class="btn btn-lg btn-primary pull-xs-right"
                            >
                                Update Settings
                            </button>
                        </fieldset>
                    </form>

                    <hr />

                    <button class="btn btn-outline-danger" @click="logout">
                        Or click here to logout.
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { updateUser } from "@/apis/user";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
    middleware: "authenticated",
    data() {
        return {
            formData: {
                email: "",
                username: "",
                bio: "",
                image: "",
            },
        };
    },
    methods: {
        init() {
            let user = JSON.parse(Cookie.get("user"));
            this.formData.email = user.email;
            this.formData.username = user.username;
            this.formData.bio = user.bio;
            this.formData.image = user.image;
        },
        async formSubmit() {
            let { data } = await updateUser(this.formData);
            if (data) {
                this.$router.push({
                    name: "profile",
                    params: {
                        username: this.formData.username,
                    },
                });
            }
        },
        logout() {
            Cookie.remove("user");
            this.$store.commit("setUser", null);
            this.$router.push("/");
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style scoped lang="less">
</style>
