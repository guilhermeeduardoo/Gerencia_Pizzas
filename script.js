let carrinho = []
let modalQuantidade = 1 
let modalChave = 0

const pegar = (el) => document.querySelector(el) 
const pegarTudo = (el) => document.querySelectorAll(el) 


pizzaJson.map(function (item,index) {
    
    let pizzaItem = pegar('.models .pizza-item').cloneNode(true)
   
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {
        evento.preventDefault() 
        let chave = evento.target.closest('.pizza-item').getAttribute('data-key')
   
        modalQuantidade = 1 
        modalChave = chave

        pegar('.pizzaBig img').src = pizzaJson[chave].img
        pegar('.pizzaInfo h1').innerHTML = pizzaJson[chave].name
        pegar('.pizzaInfo--desc').innerHTML = pizzaJson[chave].description
        pegar('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[chave].price.toFixed(2)}`
        pegar('.pizzaInfo--size.selected').classList.remove('selected')
        pegarTudo('.pizzaInfo--size').forEach((tamanho, tamanhoIndex) => {
            if(tamanhoIndex == 2) {
                tamanho.classList.add('selected')
            } 
            tamanho.querySelector('span').innerHTML = pizzaJson[chave].sizes[tamanhoIndex]
        }) 

        pegar('.pizzaInfo--qt').innerHTML = modalQuantidade
        pegar('.pizzaWindowArea').style.opacity = 0
        pegar('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            pegar('.pizzaWindowArea').style.opacity = 1
        }, 200)
    })

    pegar('.pizza-area').append(pizzaItem) 
})


function fecharModal() {
    pegar('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        pegar('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

pegarTudo('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click',fecharModal)
})

pegar('.pizzaInfo--qtmenos').addEventListener('click', () => {
   if(modalQuantidade > 1) {
    modalQuantidade--
    pegar('.pizzaInfo--qt').innerHTML = modalQuantidade
   }
})

pegar('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQuantidade++
    pegar('.pizzaInfo--qt').innerHTML = modalQuantidade
})

pegarTudo('.pizzaInfo--size').forEach((tamanho, tamanhoIndex) => { 
   tamanho.addEventListener('click', () => {
    pegar('.pizzaInfo--size.selected').classList.remove('selected')
    tamanho.classList.add('selected')
   })
})

pegar('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(pegar('.pizzaInfo--size.selected').getAttribute('data-key'))
    
    let identificador = pizzaJson[modalChave].id+'@'+size 
    
    let key = carrinho.findIndex((item) => {
        return item.identificador == identificador 
    })

    if(key > -1) {
        carrinho[key].quantidade += modalQuantidade
    } else {
        carrinho.push({
            identificador,
            id: pizzaJson[modalChave].id,
            quantidade: modalQuantidade,
            size
        })
    }
    updateCarrinho()
    fecharModal()
})

pegar('.menu-openner').addEventListener('click', () => {
    if(carrinho.length > 0) {
        pegar('aside').style.left = '0'
    }
})

pegar('.menu-closer').addEventListener('click', () => {
    pegar('aside').style.left = '100vw'
})
function updateCarrinho() {

    pegar('.menu-openner span').innerHTML = carrinho.length 

    if(carrinho.length > 0) {
        pegar('aside').classList.add('show') 
        pegar('.cart').innerHTML = '' 

        let subTotal = 0
        let desconto = 0
        let total = 0

        for(let i in carrinho) { 

            let pizzaItem = pizzaJson.find((item) => {
                return item.id == carrinho[i].id 
            })
            subTotal += pizzaItem.price * carrinho[i].quantidade

            let itemCarrinho = pegar('.models .cart--item').cloneNode(true) 
             
            let pizzaTamanhoNome
            switch(carrinho[i].size) {
                case 0:
                    pizzaTamanhoNome = 'P'
                    break
                case 1:
                    pizzaTamanhoNome = 'M'
                    break
                case 2:
                    pizzaTamanhoNome = 'G'
                    break
            }

            let pizzaNome = `${pizzaItem.name} (${pizzaTamanhoNome})`

            itemCarrinho.querySelector('img').src = pizzaItem.img
            itemCarrinho.querySelector('.cart--item-nome').innerHTML = pizzaNome
            itemCarrinho.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade 
            itemCarrinho.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(carrinho[i].quantidade > 1) {
                    carrinho[i].quantidade--
                    updateCarrinho() 
                } else {
                    carrinho.splice(i,1)
                }
                updateCarrinho()
            })
            itemCarrinho.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                carrinho[i].quantidade++
                updateCarrinho()
            })

            pegar('.cart').append(itemCarrinho) 
        }

        desconto = subTotal * 0.1
        total = subTotal - desconto

        pegar('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`
        pegar('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        pegar('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else {
        pegar('aside').classList.remove('show') 
        pegar('aside').style.left = '100vw' 
    }
}