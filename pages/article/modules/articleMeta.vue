<!--
 * article-meta
 * @module article
 * @author its-wild
 * @date 2021/05/02
-->
<template>
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
            <span class="date">{{ article.createdAt | date }}</span>
        </div>

        <template v-if="article.author.username === user.username">
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{
                name: 'editor',
                params: {
                    slug: article.slug
                }
            }">
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm" :disabled="disabledDel" @click="delArticle">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </template>

        <template v-else>
            <button
                class="btn btn-sm btn-outline-secondary"
                :class="{ active: article.author.following }"
                @click="targleFollow(article)"
                :disabled="disabledFollow"
            >
                <i class="ion-plus-round"></i>
                &nbsp; {{ article.author.following ? "Unfollow" : "Follow" }}
                {{ article.author.username }}
                <!-- <span class="counter">(10)</span> -->
            </button>
            &nbsp;&nbsp;
            <button
                class="btn btn-sm btn-outline-primary"
                :class="{ active: article.favorited }"
                @click="targleFavorite(article)"
                :disabled="disabledFavorite"
            >
                <i class="ion-heart"></i>
                &nbsp;
                {{ article.favorited ? "Unfavorite Article" : "Favorite Post" }}
                <span class="counter">({{ article.favoritesCount }})</span>
            </button>
        </template>
    </div>
</template>

<script>
import { mapState } from "vuex";

import {
    addFavorite,
    delFavorite,
    followUser,
    unFollowUser,
    delArticle,
} from "@/apis/articles";
export default {
    name: "ArticleMeta",
    props: {
        article: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {
            disabledFavorite: false,
            disabledFollow: false,
            disabledDel: false,
        };
    },
    methods: {
        async targleFavorite(article) {
            this.disabledFavorite = true;
            const { data } = article.favorited
                ? await delFavorite(article.slug)
                : await addFavorite(article.slug);
            if (data) {
                article.favorited = !article.favorited;
                article.favoritesCount += article.favorited ? 1 : -1;
            }
            this.disabledFavorite = false;
        },
        async targleFollow(article) {
            this.disabledFollow = true;
            const { data } = article.author.following
                ? await unFollowUser(article.author.username)
                : await followUser(article.author.username);
            if (data) {
                article.author.following = !article.author.following;
            }
            this.disabledFollow = false;
        },
        async delArticle() {
            this.disabledDel = true;
            let { data } = await delArticle(this.article.slug);
            if (data) {
                this.$router.push('/');
            }
            this.disabledDel = false;
        }
    },
    computed: {
        ...mapState(["user"]),
    },
};
</script>

<style scoped lang="less">
</style>
