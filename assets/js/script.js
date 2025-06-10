document.addEventListener('DOMContentLoaded', function() {

    // Функция для перемещения фокуса на следующий элемент ввода
    function moveToNextInput(currentInput) {
        const form = currentInput.closest('form'); // Находим родительскую форму
        const formInputs = Array.from(form.querySelectorAll('input[type="number"]')); // Получаем все числовые поля ввода в форме
        const currentIndex = formInputs.indexOf(currentInput); // Находим индекс текущего поля

        // Перемещаем фокус на следующее поле в текущей форме, если оно есть
        if (currentIndex < formInputs.length - 1) {
            formInputs[currentIndex + 1].focus();
        }
        // Если это последнее поле в форме Игрока 1, переходим к первому полю Игрока 2
        else if (form.id === 'player1Form' && currentIndex === formInputs.length - 1) {
             const player2FirstInput = document.getElementById('player2_game5');
             if (player2FirstInput) {
                 player2FirstInput.focus();
             }
        }
        // Если это последнее поле в форме Игрока 2, можно, например, сфокусироваться на кнопке "Рассчитать"
        else if (form.id === 'player2Form' && currentIndex === formInputs.length - 1) {
            const calculateButton = document.getElementById('calculateButton');
            if (calculateButton) {
                 calculateButton.focus();
            }
        }
    }

    // Добавляем обработчики событий для каждого поля ввода с типом number
    const allInputs = document.querySelectorAll('input[type="number"]'); // Выбираем ВСЕ числовые поля на странице
    allInputs.forEach(input => {
        // Обработчик события 'blur' (при потере фокуса полем)
        // При потере фокуса проверяем и, если нужно, перемещаем курсор.
        input.addEventListener('blur', function() {
             if (this.value !== '' && !isNaN(parseFloat(this.value))) {
                 moveToNextInput(this);
             }
        });

         // Обработчик события 'input' (для быстрого перемещения при наборе - опционально)
         // Может быть слишком агрессивным на узких экранах при наборе дробных чисел.
         // Активируйте, если считаете нужным, возможно, с более сложной логикой проверки ввода.
         /*
         input.addEventListener('input', function() {
              // Пример: перемещать, если введено число с десятичной частью (требует более точной проверки)
             // или после определенной длины ввода
             // if (ваше условие для завершенного ввода) {
             //     moveToNextInput(this);
             // }
         });
         */


        // Обработчик события 'keypress' (при нажатии клавиши)
        // Добавляем возможность перехода по нажатию Enter
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Предотвращаем стандартное действие
                 if (this.value !== '' && !isNaN(parseFloat(this.value))) {
                     moveToNextInput(this);
                 }
            }
        });
    });


    // Обработчик для кнопки расчета - ЛОГИКА НА ФРОНТЕНДЕ
    document.getElementById('calculateButton').addEventListener('click', function() {
        const player1Coeffs = [];
        const player2Coeffs = [];
        let allPlayer1Filled = true;
        let allPlayer2Filled = true;

        // Собираем коэффициенты для Игрока 1 и проверяем заполнение
        for (let i = 5; i <= 10; i++) {
            const input = document.getElementById(`player1_game${i}`);
             if (input.value !== '' && !isNaN(parseFloat(input.value))) {
                player1Coeffs.push(parseFloat(input.value));
                input.classList.remove('is-invalid'); // Удаляем класс, если поле заполнено
            } else {
                allPlayer1Filled = false;
                input.classList.add('is-invalid'); // Визуальное выделение незаполненного поля
            }
        }

        // Собираем коэффициенты для Игрока 2 и проверяем заполнение
        for (let i = 5; i <= 10; i++) {
            const input = document.getElementById(`player2_game${i}`);
             if (input.value !== '' && !isNaN(parseFloat(input.value))) {
                player2Coeffs.push(parseFloat(input.value));
                 input.classList.remove('is-invalid'); // Удаляем класс, если поле заполнено
            } else {
                 allPlayer2Filled = false;
                 input.classList.add('is-invalid'); // Визуальное выделение незаполненного поля
            }
        }


        // Проверка, что все поля заполнены
        if (!allPlayer1Filled || !allPlayer2Filled) {
            document.getElementById('error').textContent = 'Пожалуйста, заполните все коэффициенты для обоих игроков.';
            document.getElementById('error').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            return; // Прекращаем выполнение функции, если не все заполнено
        }

        // Если все поля заполнены, скрываем ошибку
         document.getElementById('error').style.display = 'none';
         document.getElementById('error').textContent = '';


        // === ЛОГИКА РАСЧЕТА НА ФРОНТЕНДЕ ===

        // Расчет суммы десятичных частей
        const sumDecimalPlayer1 = player1Coeffs.reduce((sum, coeff) => sum + (coeff % 1), 0);
        const sumDecimalPlayer2 = player2Coeffs.reduce((sum, coeff) => sum + (coeff % 1), 0);

        // Определение победителя
        let winner;
        if (sumDecimalPlayer1 < sumDecimalPlayer2) {
            winner = "Игрок 1";
        } else if (sumDecimalPlayer2 < sumDecimalPlayer1) {
            winner = "Игрок 2";
        } else {
            winner = "Ничья (суммы десятичных частей равны)";
        }

        // === ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА ===

        document.getElementById('player1_sum').textContent = `Сумма десятичных частей (Игрок 1): ${sumDecimalPlayer1.toFixed(4)}`; // Округляем для вывода
        document.getElementById('player2_sum').textContent = `Сумма десятичных частей (Игрок 2): ${sumDecimalPlayer2.toFixed(4)}`; // Округляем для вывода
        document.getElementById('winner').textContent = `Победитель: ${winner}`;
        document.getElementById('result').style.display = 'block';
    });

}); // Закрытие DOMContentLoaded
