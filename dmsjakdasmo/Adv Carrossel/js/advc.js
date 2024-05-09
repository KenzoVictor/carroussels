const contentSlider = document.querySelector(".content-slider");
const container = document.querySelector('.slider-container');
const slides = document.querySelectorAll('.slide');
const arrLeft = document.querySelector(".arrow-left");
const arrRight = document.querySelector(".arrow-right");

// Valor do slide container //
let offset = 0;
// ID do Slide incremento //
let slideIncrement = 0;
// ID do Slide decremento //
let slideDecrement = slides.length - 1;

//Posição do drag no axis X//
let dragPosition = 0;
//Valor anterior do drag//
let prev = 0;
// Calculo da posição do drag//
let cacl = 0;
//Cordenada X do cliente//
let x;
// Quantos slides mover//
let slideAmmount;

// Adicionar evento de clique na seta da direita//
arrRight.addEventListener('click', slideNext);

function slideNext(){
    //calcula o numero de slides para mexer com base na largura do carrossel conteiner e a largura do slide unico//
    slideAmmount = Math.round(contentSlider.offsetWidth / slides[0].offsetWidth);

    //desabilita o botão "next" temporáriamente para previnir vários cliques durante a animação//
    arrRight.ariaDisabled = true; 

    //calcula a distância para mover o carrossel conteiner baseado na largura de cada slide individual e o número de slides para mover//
    offset = slides[0].offsetWidth * slideAmmount;

    //Aplica a animação de transição suavemente para mover o conteiner do carrossel//
    container.style.transition = "left ease-in-out 500ms";
    container.style.left = -offset + 'px';

    //Após delay de 500ms (0,5s), reseta a transição e reorganiza os slides//
    setTimeout(() => {
        //remove a animação de transição//
        container.style.transition = "none";

        //Loop entre os slides para reorganizar a ordem//
        for(let i = 0; i < slideAmmount; i++){
            //Checar se o slide atual ultrapassa o total de número de slides//
            if(slideIncrement > slides.length - 1){
                //se o index exceder o número total de slides é settado uma nova posição//
                slideIncrement = slideIncrement - slides.length;

                //reseta a ordem de todos slides para ordem inicial//
                slides.forEach(slide => {
                    slide.style.order = "initial";
                });
            }
            // seta a ordem dos slides atuais na última posição//
            slides[slideIncrement].style.order = slides.length - 1;

            //icrementa o index do slide para a próxima interção//
            slideIncrement++;
        }
        //reseta a posição da esquerda do container carrossel//
        container.style.left = 0;

        // atualiza o slide decrementado para o index do último slide//
        slideDecrement = slideIncrement - 1;

        //re habilita o botão "next"//
        arrRight.disabled = false;
    }, 500);
}

arrLeft.addEventListener('click', slidePrev);

function slidePrev(){
    //calcula o número de slides que move com base no container carrossel e a largura de cada slide//
    slideAmmount = Math.round(contentSlider.offsetWidth / slides[0].offsetWidth);

    //disabilita o botão "anterior" temporáriamente para prever múltiplos cliques durante a animação//
    arrLeft.disabled = true;

    //remove qualquer animação de transição existente do conteiner carrossel//
    container.style.transition = "none";

    // Loop através de um número especifico de slides para mover//
    for(let i = 0; i < slideAmmount; i++){
        // Checa se o idex de slide de decremento e menor que 0 (se vai antes do primeiro index de slide)//
        if(slideDecrement <0){
            // reseta a ordem de todos os slides para a ordem inicial//
            slides.forEach((slide) => {
                slide.style.order = "initial";
            });
            // ajusto o index de decremento para nova posição//
            slideDecrement = slideDecrement + slides.length;
        }
        //seta a ordem do slide atual para posição -1 (prioriza-o para o primeiro slide visual)//
        slides[slideDecrement].style.order = "-1";

        //decrementa o index de decrementação para próxima interação//
        slideDecrement--;
    }
    //atualiza o index de incrementação para corresponder o index de decrementar ajustado//
    slideIncrement = slideDecrement + 1;

    // re-habilita o botão "anterior"//
    arrLeft.disabled = false;

    //ajusta a posição esquerda do container carrossel para mostrar o set de slides//
    container.style.left = -offset + 'px';

    //depois de um pequeno delay (10milisegundos), aplica a animação de transição para mover suavemente o carrossel para posição inicial//
    setTimeout(() => {
        container.style.transition = "left ease-in-out 500ms";
        container.style.left = 0;
    }, 10);
}

function drag(e){
    //determina a distância do drag baseado no tipo de evento (mouse ou touch screen)//
    if(e.type === "touchmove"){
        cacl = (e.touches[0].clientX - x) / 1;
    } else {
        cacl = (e.clientX - x) / 1;
    }
    // calcula a nova posição do drag por adicionar uma distância calculada entre a última posição//
    dragPosition = cacl + prev;
}

// adiciona event listeners para o mouse poder "dragar"//
container.addEventListener("mousedown", (e) => {
    //armazena a cordenada x inicial do ponteiro do mouse//
    x = e.clientX;

    //adiciona o evento drag event listener enquanto mouse se mexe//
    container.addEventListener("mousemove", drag);

    //atualiza a posição anterior por adicionar distancia calculada//
    prev += cacl;
});

//adiciona event listeners para touch events para adicionar dragging na tela touchscreen//
container.addEventListener("touchstart", (e) =>{
    //armazena cordenada inicial x do ponto tocado//
    x = e.touches[0].clientX;

    //adiciona o drag event listener enquanto touch está sendo movido//
    container.addEventListener("touchmove", drag);

    //atualiza a posição anterior por adicionar a distancia calculada//
    prev += cacl;
});

//adiciona event listeners para o fim de cada drag (mouse release ou touch release)//
container.addEventListener("mouseup", handleDragEnd);
container.addEventListener("touchend", handleDragEnd);

function handleDragEnd(){
    //checa a posição do drag relativa a posição anterior para determinar a direção do drag//
    if(dragPosition < prev){
        //se a posição do drag é menos que a posição anterior, o slide move para os próximos slides//
        slideNext();
    } else if(dragPosition > prev){
        //se a posição do drag for maior que a posição anterior, o slide move para os slides anteriores//
        slidePrev();
    }

    //remover os drag event listeners
    container.removeEventListener("mousemove", drag);
    container.removeEventListener("touchmove", drag);
}