<!--
 * 文章评论
 * @module article
 * @author its-wild
 * @date 2021/05/03
-->
<template>
    <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
            <form class="card comment-form" @submit.prevent="haddlePostComment">
                <div class="card-block">
                    <textarea
                        class="form-control"
                        placeholder="Write a comment..."
                        rows="3"
                        v-model="comment"
                    ></textarea>
                </div>
                <div class="card-footer">
                    <img :src="user.image" class="comment-author-img" />
                    <button class="btn btn-sm btn-primary" :disabled="disabled">
                        Post Comment
                    </button>
                </div>
            </form>

            <div v-for="comment in comments" :key="comment.id" class="card">
                <div class="card-block">
                    <p class="card-text">
                        {{ comment.body }}
                    </p>
                </div>
                <div class="card-footer">
                    <nuxt-link
                        class="comment-author"
                        :to="{
                            name: 'profile',
                            params: {
                                username: comment.author.username,
                            },
                        }"
                    >
                        <img
                            class="comment-author-img"
                            :src="comment.author.image"
                        />
                    </nuxt-link>
                    &nbsp;
                    <nuxt-link
                        class="comment-author"
                        :to="{
                            name: 'profile',
                            params: {
                                username: comment.author.username,
                            },
                        }"
                    >
                        {{ comment.author.username }}
                    </nuxt-link>
                    <span class="date-posted">
                        {{ comment.createdAt | date }}
                    </span>
                    <span v-if="user.username === comment.author.username" class="mod-options" @click="delComment(comment)">
                        <i class="ion-trash-a"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getComments, addComment, delComment } from "@/apis/articles";

export default {
    name: "ArticleComment",
    props: {
        article: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {
            comments: [],
            comment: "",
            disabled: false,
            delDisabled: false,
        };
    },
    methods: {
        async getCommentsData() {
            const { data } = await getComments(this.article.slug);
            this.comments = data.comments || [];
        },
        async haddlePostComment() {
            if (!this.comment) {
                return;
            }
            this.disabled = true;
            const { data } = await addComment(this.article.slug, {
                comment: {
                    body: this.comment,
                },
            });

            if (data) {
                this.comments.unshift(data.comment);
                this.comment = "";
            }
            this.disabled = false;
        },
        async delComment(comment) {
            if (this.delDisabled) {
                return;
            }
            this.delDisabled = true;
            const { data } = await delComment(this.article.slug, comment.id)
            if (data) {
                this.getCommentsData();
            }
            this.delDisabled = false;
        }
    },
    created() {
        this.getCommentsData();
    },
    computed: {
        ...mapState(["user"]),
    },
};
</script>

<style scoped lang="less">
</style>
