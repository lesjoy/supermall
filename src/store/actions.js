export default {
    // dispatch会返回一个promise
    addCart(context, payload) {
        // 如果在vuex中完成了某个操作，想让外面知道，就要用到promise
        return new Promise((resolve, reject) => {
            //payload新添加的商品
            let oldProduct = null
            for (let item of context.state.cartList) {
                if (item.iid === payload.iid) {
                    oldProduct = item
                }
            }
            if (oldProduct) {
                context.commit('addCounter', oldProduct)
                resolve('当前的商品数量+1')
            } else {
                payload.count = 1
                // state.cartList.push(payload)
                context.commit('addToCart', payload)
                resolve('添加了新的商品')

            }
        })
    }
}