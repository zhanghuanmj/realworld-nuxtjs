<!--
 * 首页
 * @module home
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div class="home-page">
        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li v-if="user" class="nav-item">
                                <nuxt-link
                                    class="nav-link"
                                    :class="{ active: tab === 'your_feed' }"
                                    exact
                                    :to="{
                                        name: 'home',
                                        query: {
                                            tab: 'your_feed',
                                        },
                                    }"
                                >
                                    Your Feed
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link
                                    class="nav-link"
                                    :class="{ active: tab === 'global_feed' }"
                                    exact
                                    :to="{
                                        name: 'home',
                                        query: {
                                            tab: 'global_feed',
                                        },
                                    }"
                                >
                                    Global Feed
                                </nuxt-link>
                            </li>
                            <li v-if="tab === 'tag'" class="nav-item">
                                <nuxt-link
                                    class="nav-link active"
                                    exact
                                    :to="{
                                        name: 'home',
                                        query: {
                                            tab: 'tag',
                                        },
                                    }"
                                >
                                    #{{ tag }}
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
                                    {{
                                    article.createdAt | date
                                }}
                                </span>
                            </div>
                            <button
                                class="btn btn-outline-primary btn-sm pull-xs-right"
                                :class="{active: article.favorited}"
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
                            <!---->
                            <li v-for="page in totalPage" :key="page" class="page-item" :class="{active: pageNum == page}">
                                <nuxt-link :to="{
                                    name: 'home',
                                    query: {
                                        tab: tab,
                                        tag: tag,
                                        pageNum: page
                                    }
                                }" class="page-link">{{ page }}</nuxt-link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>

                        <div class="tag-list">
                            <nuxt-link
                                v-for="tag in tags"
                                :key="tag"
                                :to="{
                                    name: 'home',
                                    query: {
                                        tab: 'tag',
                                        tag: tag,
                                    },
                                }"
                                class="tag-pill tag-default"
                            >
                                {{ tag }}
                            </nuxt-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getAllArticles, getTags, getArticlesFeed, addFavorite, delFavorite } from "@/apis/articles";

export default {
    name: "homePage",
    data() {
        return {};
    },
    async asyncData({ route }) {
        const { tab = "global_feed", tag, pageNum = 1 } = route.query;
        const limit = 20;
        const offset = (pageNum - 1) * limit;
        const params = {
            limit,
            offset,
            tag,
        };
        const [articlesData, tagsData] = await Promise.all([
            tab === "your_feed"
                ? getArticlesFeed(params)
                : getAllArticles(params),
            getTags(),
        ]);
        const { articles, articlesCount } = articlesData.data;
        const { tags } = tagsData.data;
        const totalPage = Math.ceil(articlesCount / limit);

        articles.forEach(article => {
            article.disabled = false;
        });

        return {
            tab,
            articles,
            articlesCount,
            tags,
            tag,
            totalPage,
            pageNum,
        };
    },
    watchQuery: ["tab", "tag", "pageNum"],
    methods: {
        async targleFavorite(article) {
            article.disabled = true;
            const { data } = article.favorited ? await delFavorite(article.slug) : await addFavorite(article.slug);
            if (data) {
                article.favorited = !article.favorited;
                article.favoritesCount += article.favorited ? 1 : -1;
            }
            article.disabled = false;
        }
    },
    computed: {
        ...mapState(["user"]),
    },
};
</script>

<style scoped lang="less">
</style>
