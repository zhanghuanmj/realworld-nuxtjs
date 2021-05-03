<!--
 * 个人资料
 * @module profile
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img :src="profile.image" class="user-img" />
                        <h4>{{ username }}</h4>
                        <p>
                            {{ profile.bio }}
                        </p>

                        <nuxt-link
                            v-if="profile.username === user.username"
                            class="btn btn-sm btn-outline-secondary action-btn"
                            to="/settings"
                        >
                            <i class="ion-gear-a"></i> Edit Profile Settings
                        </nuxt-link>

                        <button
                            v-else
                            class="btn btn-sm btn-outline-secondary action-btn"
                            :class="{ active: profile.following }"
                            @click="targleFollow(profile)"
                            :disabled="disabledFollow"
                        >
                            <i class="ion-plus-round"></i>
                            &nbsp;
                            {{ profile.following ? "Unfollow" : "Follow" }}
                            {{ profile.username }}
                            <!-- <span class="counter">(10)</span> -->
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <nuxt-link
                                    class="nav-link"
                                    exact
                                    :class="{ active: tab === 'my_articles' }"
                                    :to="{
                                        name: 'profile',
                                        query: {
                                            tab: 'my_articles',
                                        },
                                    }"
                                >
                                    My Articles
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link
                                    class="nav-link"
                                    exact
                                    :class="{
                                        active: tab === 'favorited_articles',
                                    }"
                                    :to="{
                                        name: 'profile',
                                        query: {
                                            tab: 'favorited_articles',
                                        },
                                    }"
                                >
                                    Favorited Articles
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <div
                        v-for="article in articles"
                        :key="article.slug"
                        class="article-preview"
                    >
                        <div class="article-meta">
                            <nuxt-link
                                :to="{
                                    name: 'profile',
                                    params: {
                                        username: article.author.username,
                                    },
                                }"
                            >
                                <img :src="article.author.image" />
                            </nuxt-link>
                            <div class="info">
                                <nuxt-link
                                    class="author"
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            username: article.author.username,
                                        },
                                    }"
                                >
                                    {{ article.author.username }}
                                </nuxt-link>
                                <span class="date">
                                    {{ article.createdAt | date }}
                                </span>
                            </div>
                            <button
                                class="btn btn-outline-primary btn-sm pull-xs-right"
                                :class="{ active: article.favorited }"
                                @click="targleFavorite(article)"
                                :disabled="article.disabled"
                            >
                                <i class="ion-heart"></i>
                                {{ article.favoritesCount }}
                            </button>
                        </div>
                        <nuxt-link
                            :to="{
                                name: 'article',
                                params: {
                                    slug: article.slug,
                                },
                            }"
                            class="preview-link"
                        >
                            <h1>{{ article.title }}</h1>
                            <p>{{ article.description }}</p>
                            <span>Read more...</span>
                        </nuxt-link>
                    </div>

                    <nav v-show="totalPage > 1">
                        <ul class="pagination">
                            <li
                                v-for="page in totalPage"
                                :key="page"
                                class="page-item"
                                :class="{ active: pageNum == page }"
                            >
                                <nuxt-link
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            username: user.username,
                                        },
                                        query: {
                                            tab: tab,
                                            pageNum: page,
                                        },
                                    }"
                                    class="page-link"
                                    >{{ page }}</nuxt-link
                                >
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getAllArticles,
    addFavorite,
    delFavorite,
    followUser,
    unFollowUser,
} from "@/apis/articles";
import { getProfile } from "@/apis/user";
import { mapState } from "vuex";

export default {
    middleware: "authenticated",
    data() {
        return {
            username: "",
            tab: "my_articles",
            pageNum: 1,
            totalPage: 1,
            articles: [],
            profile: {},
            disabledFollow: false,
        };
    },
    methods: {
        init() {
            let { username } = this.$route.params;
            let { tab = "my_articles", pageNum = 1 } = this.$route.query;
            this.tab = tab;
            this.pageNum = pageNum;
            this.username = username;
            this.getProfile();
            this.getData();
        },
        async getData() {
            const limit = 20;
            const offset = (this.pageNum - 1) * limit;
            const params = {
                limit,
                offset,
            };
            if (this.tab === "my_articles") {
                params.author = this.username;
            } else {
                params.favorited = this.username;
            }
            let { data } = await getAllArticles(params);
            let { articlesCount, articles } = data;

            articles.forEach((article) => {
                article.disabled = false;
            });
            this.totalPage = Math.ceil(articlesCount / limit);
            this.articles = articles;
        },
        async getProfile() {
            let { data } = await getProfile(this.username);
            let { profile } = data;
            this.profile = profile;
        },
        async targleFavorite(article) {
            article.disabled = true;
            const { data } = article.favorited
                ? await delFavorite(article.slug)
                : await addFavorite(article.slug);
            if (data) {
                this.init();
            }
            article.disabled = false;
        },
        async targleFollow(profile) {
            this.disabledFollow = true;
            const { data } = profile.following
                ? await unFollowUser(profile.username)
                : await followUser(profile.username);
            if (data) {
                profile.following = !profile.following;
            }
            this.disabledFollow = false;
        },
    },
    created() {
        this.init();
    },
    watch: {
        $route: function () {
            this.init();
        },
    },
    computed: {
        ...mapState(["user"]),
    },
};
</script>

<style scoped lang="less">
</style>
