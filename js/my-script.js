(function($){
	$(function(){
		
		$.fn.forLettersOnly = function() {
    		return this.each(function(){
        		$(this).keydown(function(e){
            		let key = e.charCode || e.keyCode || 0;
					let flag = ( key == 8 || key == 9 || key == 46 ||(key >= 37 && key <= 40) ||(key >= 65 && key <= 90) ||(key >= 96 && key <= 105) || key == 107 || key == 109 || key == 173|| key == 61 );
                    if(flag){
                        $(this).css({'border-color': 'white'});
                    }else{
                        $(this).css({'border-color': 'red'});
                    }

           			return flag;
           		});	
    		});
		};

		$.fn.forNumberOnly = function() {
    		return this.each(function(){
        		$(this).keydown(function(e){
            		let key = e.charCode || e.keyCode || 0;
            		let flag = ( key == 8 || key == 9 || key == 46 ||(key >= 37 && key <= 40) ||(key >= 48 && key <= 57) ||(key >= 96 && key <= 105) || key == 107 || key == 109 || key == 173|| key == 61  )

					if(flag){
                        $(this).css({'border-color': 'white'});
					}else{
                        $(this).css({'border-color': 'red'});
					}
            		return flag;
    			});
			});
		};

		
		$('#userName').forLettersOnly();// только буквы
		$('.pointList input').forNumberOnly(); // только цифры

		

		$('.forUserName button').click(function(){// кнопка продолжить после ввода имени
			$('.startPage').toggle(500);
			$('.gamePage').toggle(500);
			$('#yourName').html($('#userName').val());
		})

		$('.error button').click(function(){
            $('.error').slideUp(700);
		});

		$('.repCard').click(function(){
			$('.cardAcount').slideDown(700);
		})

		let money = document.querySelector('#money span');
		let rate = document.querySelector('#rate span');
		let win = document.querySelector('#winSum');
		let generalWinAmount = 0;

		$('.replenish').click(function(){
			//let sumInput = $('.cardAcount input');
			let sumInput = $('.cardAcount input');
			let current = parseInt(money.innerHTML);
			money.innerHTML = (current + parseInt(sumInput.val()));
			if(sumInput.val() == 0){money.innerHTML = current + 0};
			sumInput.val('');
			
			
			$('.cardAcount').slideUp(700);
		});

		$('.placeAbet').click(function(){
			$('.rateBlock').slideDown(700);
		});

		$('.doRate').click(function(){
			let rateInput = document.querySelector('.rateBlock input');
			let current = parseInt(money.innerHTML); 
			if(current >= rateInput.value){
				rate.innerHTML = Number(rateInput.value);
				money.innerHTML = Number(money.innerHTML - rate.innerHTML);
				rateInput.value = ' ';
				$('.rateBlock').slideUp(700);
			} else {
                showError();
                rateInput.value = ' ';
			}
		});
		
		class Spinner{
			sliders = [];
			keys = '';
			combos = {
				'111': 800,
				'222': 200,
				'333': 80,
				'444': 40,
				'555': 20,
				'666': 10
			};

			wheelSpin(){ // запуск барабана
                this.keys = '';
				if(this.sliders && this.sliders.length){
					let i = 0;// для скорости 
                    this.sliders.forEach(function (slider) {
                        setTimeout(function(){
                            slider.$Play(); //https://www.jssor.com/development/api-options.html
                        }, i*100);
                        i++;
                    });
				}else{
					this.buildSliders();
				}
			}

			buildSliders(){//  картинки
                $('div.slider-col').each(function(i, elem){
                    setTimeout(function(){
                    	let slider = new $JssorSlider$($(elem).attr('id'), {
                            $AutoPlay: 1, //https://www.jssor.com/development/api-options.html
                            $DragOrientation: 2,
                            $PlayOrientation: 2,
                            $Loop: 1,
                            $Idle: 10,
                            $SlideDuration: 50
                        });
                        this.sliders.push(slider);
                    }.bind(this), i*100);
                }.bind(this));
			}

			stopWheel(){
                this.sliders.forEach(function (slider) {
					let key = this.getRandomKey(1, 6);
                    slider.$Pause(); //https://www.jssor.com/development/api-options.html
                    slider.$PlayTo(key - 1); //https://www.jssor.com/development/api-options.html
                    this.keys += key;
                }, this);

                let mult = this.getMultiplier();
                let currentBet = parseInt(rate.innerHTML);
                let currentWin = currentBet * mult;

                let currentMoney = parseInt(money.innerHTML);
                money.innerHTML = currentMoney + currentWin;
                rate.innerHTML = 0;

                generalWinAmount += currentWin;
                win.innerHTML = generalWinAmount;
			}

			getMultiplier(){ // для одного и двуч котлов
				let multiplier = 0;

				if(typeof this.combos[this.keys] !== 'undefined'){
					multiplier = this.combos[this.keys];
				}else if(this.keys.indexOf('6') !== -1){
                    let matches = this.keys.match(/6/g);
                    multiplier = (matches.length === 2) ? 5 : 2;
				}
				return multiplier;
			}

			getRandomKey(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
			}
		}

		let spinner = new Spinner();
		$('button#start').click(function(e){
			if(parseInt(rate.innerHTML) === 0){
                showError();
			} else {
                spinner.wheelSpin();
                setTimeout(function(){
                    spinner.stopWheel();
                }, 3000);
			}




		});

		function showError(){
            $('.rateBlock').slideUp(700);
            $('.cardAcount').slideUp(700);
            $('.error').slideDown(700);
		}
	});
})(jQuery);