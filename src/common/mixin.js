import { debounce } from "common/utils";
import BackTop from "components/content/backTop/BackTop";


export const itemListenerMixin = {

    data() {
        return {
            itemImgListener: null,

        }
    },
    mounted() {
        const refresh = debounce(this.$refs.scroll.scroll.refresh, 50);
        this.itemImgListener = () => {
            refresh();
        };

        this.$bus.$on("itemImageLoad", this.itemImgListener);
        // console.log('我是混入中的内容');
    },
}
export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShow: false,
        }
    },

    methods: {
        // 点击返回顶部按钮，返回顶部
        backClick() {
            this.$refs.scroll.scroll.scrollTo(0, 0);
        },

    },
}