export default {

    addCunter(state, payload) {
        payload.count++

    },
    addToCart(state, payload) {
        payload.checked = true
        state.cartList.push(payload)
    }
}