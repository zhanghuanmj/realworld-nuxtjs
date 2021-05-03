<!--
 * 创建文章
 * @module editor
 * @author its-wild
 * @date 2021/04/30
-->
<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <form @submit.prevent="createArticle">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="Article Title"
                                    v-model="formData.title"
                                    required
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="What's this article about?"
                                    v-model="formData.description"
                                    required
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    class="form-control"
                                    rows="8"
                                    placeholder="Write your article (in markdown)"
                                    v-model="formData.body"
                                    required
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Enter tags"
                                    v-model="formData.tags"
                                    required
                                />
                                <div class="tag-list"></div>
                            </fieldset>
                            <button
                                :disabled="disabled"
                                class="btn btn-lg pull-xs-right btn-primary"
                            >
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from "@/apis/articles";

export default {
    middleware: "authenticated",
    data() {
        return {
            disabled: false,
            formData: {
                title: "",
                description: "",
                body: "",
                tags: "",
                tagList: [],
            },
            article: {}
        };
    },
    methods: {
        async getArticle() {
            if (!this.$route.params.slug) {
                return;
            }
            let { data } = await getArticle(this.$route.params.slug);
            let { article } = data;
            if (article) {
                this.article = article;
                this.formData.title = article.title;
                this.formData.description = article.description;
                this.formData.body = article.body;
                this.formData.tags = article.tagList.join(" ");
            }
        },
        async createArticle() {
            this.disabled = true;
            this.formData.tagList = this.formData.tags.split(/\s+/);
            let { data } = this.$route.params.slug ? await updateArticle(this.article.slug, this.formData) : await createArticle(this.formData);
            let { article } = data;
            if (article) {
                this.$router.push({
                    name: "article",
                    params: {
                        slug: article.slug,
                    },
                });
            }
            this.disabled = false;
        },
    },
    created() {
        this.getArticle();
    },
};
</script>

<style scoped lang="less">
</style>
