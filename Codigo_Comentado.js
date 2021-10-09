let carrinho = []
let modalQuantidade = 1 // Quantidade de pizzas a serem escolhidas
let modalChave = 0

const pegar = (el) => document.querySelector(el) // Criando um atalho para o querySelector
const pegarTudo = (el) => document.querySelectorAll(el) // Criando um atalho para o querySelectorAll

// Usei o "map" para setar uma função para cada, o qual o primeiro parâmetro é o propio item e o segundo é sua posição
pizzaJson.map(function (item,index) {
     // Ele pega tudo que estivar dentro do item e o clona
    let pizzaItem = pegar('.models .pizza-item').cloneNode(true)
    // Coloca-se o ".pizza-item" para indicar que você quer acessa-lo e não o ".models"

    // Preencher as informações em "pizza-item"

    /* Inserimos em pizzaItem qual é chave daquela pizza especifica, ou seja, seu local no vetor,
       colocando 'data-key' no HTML com o valor de index, que é a sua alocação no vetor */ 
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {
        evento.preventDefault() // Faz com que atela não atualize quando acontecer o evento de click
        let chave = evento.target.closest('.pizza-item').getAttribute('data-key')
   /* Usa-se o "closest" para pegar o elemento que estiver mias perto do elemento setado depois usa-se o "getAttribute" para pegar o atributo que estiver noo elemento selcionado */ 
        modalQuantidade = 1 // Dessa forma sempre que o modal for aberto ele irá estar com 1 na quantidade de pizzas
        modalChave = chave // Sempre que abrir o modal ele irá preencher o "modalChave" com o index da pizza selecionada

        pegar('.pizzaBig img').src = pizzaJson[chave].img
        pegar('.pizzaInfo h1').innerHTML = pizzaJson[chave].name
        pegar('.pizzaInfo--desc').innerHTML = pizzaJson[chave].description
        pegar('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[chave].price.toFixed(2)}`
        pegar('.pizzaInfo--size.selected').classList.remove('selected')
        // Para pegar cada item iremos usar o "forEach" que irá aplicar uma função para cada, ele recebe como parâmetro o propio item e seu index
        pegarTudo('.pizzaInfo--size').forEach((tamanho, tamanhoIndex) => {
            // Sempre que clicar em uma pizza o tamanho grande virá selecionado, mas quando sair do modal, ele irá reiniciar 
            if(tamanhoIndex == 2) {
                tamanho.classList.add('selected')
            }
            // Pegando e setando os tamanhos das pizzas diante da sua chave 
            tamanho.querySelector('span').innerHTML = pizzaJson[chave].sizes[tamanhoIndex]
        }) 

        pegar('.pizzaInfo--qt').innerHTML = modalQuantidade

        // Foma de colocar uma animação no modal, ele irá trocar a opacidade do "pizzaWindowArea" de 0 para 100, depois do time setado
        pegar('.pizzaWindowArea').style.opacity = 0
        pegar('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            pegar('.pizzaWindowArea').style.opacity = 1
        }, 200)
    })

    pegar('.pizza-area').append(pizzaItem) // Usa o "append" pois ele adiciona em qaunto o "innerHTML" substitui
})

// Eventos do Modal

/* Tem que colocar o "display = 'none'", pois com a opacidade zerada ele so a deixa transparente, então, temos que usar o "none" para tirar a div */
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
    
    let identificador = pizzaJson[modalChave].id+'@'+size // Identificador para gerenciar a adição da quantidade das pizzas, no caso, de se adicionar mais pizzas sendo ela a mesma, não criando um obejto novo e sim adicionando no anterior
    
    let key = carrinho.findIndex((item) => {
        return item.identificador == identificador // Ele procuara os identificadores iguais, se achar ele retorna seu index, se não retorna -1
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

    pegar('.menu-openner span').innerHTML = carrinho.length // Usou-se o length para indicar a o tamanho do vetor, dessa forma, setando quantas pizzas tem no carrinho

    if(carrinho.length > 0) {
        pegar('aside').classList.add('show') // O "show" foi uma tag feita para mostrar o carrinho, caso ele seja removida o carrinho some
        pegar('.cart').innerHTML = '' // Zerar sempre que for o mesmo elemento adicionado

        let subTotal = 0
        let desconto = 0
        let total = 0

        for(let i in carrinho) { // Um "map" também funcionaria

            let pizzaItem = pizzaJson.find((item) => {
                return item.id == carrinho[i].id // Esse função diz que irá retornar as informações da pizza escolhida se o id do elemento fosse o mesmo do que esta no carrinho
            })
            subTotal += pizzaItem.price * carrinho[i].quantidade

            let itemCarrinho = pegar('.models .cart--item').cloneNode(true) // Clonou os items
            
            // O "switch" serve para colocar o tamanho das pizzas diante de cada caso, no caso, ele troca no numero do tamanho por uma string indicando o mesmo 
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
            itemCarrinho.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade // Pega do carrinho a quantidade
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

            pegar('.cart').append(itemCarrinho) // Adicionou os items
        }

        desconto = subTotal * 0.1
        total = subTotal - desconto

        // Listando o "subtotal", "desconto" e "total" usando o "last-child" o ultimo filho do "span"
        pegar('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`
        pegar('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        pegar('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else {
        pegar('aside').classList.remove('show') // Desktop
        pegar('aside').style.left = '100vw' // Mobile, tem que colocar essa linha para fechar o "aside" no mobile
    }
}