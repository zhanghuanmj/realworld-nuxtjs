<!--
 * 文章详情
 * @module article
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div class="article-page">
        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>
                <article-meta :article="article" />
            </div>
        </div>

        <div class="container page">
            <div class="row article-content">
                <div class="col-md-12" v-html="article.body"></div>
            </div>

            <hr />

            <div class="article-actions">
                <article-meta :article="article" />
            </div>

            <article-comment :article="article"/>
        </div>
    </div>
</template>

<script>
import { getArticle } from "@/apis/articles";
import articleMeta from "./modules/articleMeta.vue";
import MarkdownIt from "markdown-it";
import ArticleComment from './modules/articleComment.vue';

export default {
    components: { articleMeta, ArticleComment },
    data() {
        return {};
    },
    async asyncData({ route }) {
        const { slug } = route.params;

        const [articleData] = await Promise.all([getArticle(slug)]);
        const { article } = articleData.data;
        const md = new MarkdownIt();

        article.body = md.render(article.body);

        return {
            article,
        };
    },
    methods: {},
};
</script>

<style scoped lang="less">
</style>
