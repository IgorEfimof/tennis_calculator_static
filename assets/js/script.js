document.addEventListener('DOMContentLoaded', function() {

    // Функция для перемещения фокуса на следующий элемент ввода
    function moveToNextInput(currentInput) {
        const form = currentInput.closest('form'); // Находим родительскую форму
        const formInputs = Array.from(form.querySelectorAll('input[type="number"]')); // Получаем все числовые поля ввода в форме
        const currentIndex = formInputs.indexOf(currentInput); // Находим индекс текущего поля

        if (currentIndex < formInputs.length - 1) {
            formInputs[currentIndex + 1].focus();
        }
        // Дополнительная логика для перехода между формами, если нужно:
        // Если это последнее поле Игрока 1, перейти к первому полю Игрока 2
        if (form.id === 'player1Form' && currentIndex === formInputs.length - 1) {
             const player2FirstInput = document.getElementById('player2_game5');
             if (player2FirstInput) {
                 player2FirstInput.focus();
             }
        }
    }

    // Добавляем обработчики событий для каждого поля ввода с типом number
    const allInputs = document.querySelectorAll('input[type="number"]'); // Выбираем ВСЕ числовые поля на странице
    allInputs.forEach(input => {
        // Обработчик события 'blur' (при потере фокуса полем)
        input.addEventListener('blur', function() {
             if (this.value !== '' && !isNaN(parseFloat(this.value))) {
                 // Удалена автоматическая фокусировка по blur, так как это может быть неожиданно после ручного перемещения фокуса
                 // Лучше полагаться на Enter или ручной клик/тап.
             }
        });

        // Обработчик события 'input' для более быстрого перемещения (осторожно с этим)
        // Можно настроить так, чтобы перемещение происходило только после ввода числа
        // (например, если оно содержит точку и цифру после или является целым числом)
        input.addEventListener('input', function() {
            // Простая проверка: если введенное значение выглядит как число
            if (this.value && !isNaN(parseFloat(this.value))) {
                // Дополнительно: проверьте, является ли ввод "завершенным" числом (например, есть ли десятичная точка и цифры после нее)
                // Это может быть сложно. Альтернативно, можно перемещать после определенной длины ввода,
                // но это менее надежно для дробных чисел.

                // Для простой реализации перемещаем фокус после потери фокуса или нажатия Enter.
                // Автоматическое перемещение по input может быть слишком агрессивным.
            }
        });


        // Обработчик события 'keypress' (при нажатии клавиши)
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                 if (this.value !== '' && !isNaN(parseFloat(this.value))) {
                     moveToNextInput(this);
                 }
            }
        });
    });


    // Обработчик для кнопки расчета - ЛОГИКА ПЕРЕМЕЩЕНА НА ФРОНТЕНД
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
            } else {
                allPlayer1Filled = false;
                input.classList.add('is-invalid'); // Визуальное выделение незаполненного поля (Bootstrap)
            }
        }

        // Собираем коэффициенты для Игрока 2 и проверяем заполнение
        for (let i = 5; i <= 10; i++) {
            const input = document.getElementById(`player2_game${i}`);
             if (input.value !== '' && !isNaN(parseFloat(input.value))) {
                player2Coeffs.push(parseFloat(input.value));
            } else {
                 allPlayer2Filled = false;
                 input.classList.add('is-invalid'); // Визуальное выделение незаполненного поля (Bootstrap)
            }
        }

        // Удаляем класс 'is-invalid' с полей, которые могли быть выделены ранее
        allInputs.forEach(input => {
            if (input.classList.contains('is-invalid') && input.value !== '' && !isNaN(parseFloat(input.value))) {
                input.classList.remove('is-invalid');
            }
        });


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
