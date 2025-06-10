document.addEventListener('DOMContentLoaded', function() {
    const fields = [
        'g5p1', 'g5p2', 'g6p1', 'g6p2', 'g7p1', 'g7p2', 'g8p1', 'g8p2', 'g9p1', 'g9p2', 'g10p1', 'g10p2'
    ];

    function handleInput(e, idx) {
        let input = e.target;
        let val = input.value.replace(/[^\d]/g, '');

        if (val.length > 1) {
            val = val.slice(0, 1) + '.' + val.slice(1, 3);
        }
        if (val.length > 4) val = val.slice(0, 4);

        input.value = val;

        if (val.length === 4) {
            if (idx < fields.length - 1) {
                document.getElementById(fields[idx + 1]).focus();
            } else {
                input.blur();
                calculateWinner();
            }
        }
    }

    function handlePaste(e, idx) {
        e.preventDefault();
        let text = (e.clipboardData || window.clipboardData).getData('text');
        text = text.replace(/[^\d]/g, '');
        if (text.length > 1) {
            text = text.slice(0, 1) + '.' + text.slice(1, 3);
        }
        if (text.length > 4) text = text.slice(0, 4);

        e.target.value = text;
        if (text.length === 4) {
            if (idx < fields.length - 1) {
                document.getElementById(fields[idx + 1]).focus();
            } else {
                e.target.blur();
                calculateWinner();
            }
        }
    }

    fields.forEach((id, idx) => {
        const input = document.getElementById(id);
        input.setAttribute('maxlength', '4');
        input.setAttribute('inputmode', 'decimal');
        input.classList.add('text-center');

        input.addEventListener('input', (e) => handleInput(e, idx));
        input.addEventListener('paste', (e) => handlePaste(e, idx));
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (idx < fields.length - 1) {
                    document.getElementById(fields[idx + 1]).focus();
                } else {
                    input.blur();
                    calculateWinner();
                }
            }
        });
    });

    function calculateWinner() {
        let player1Coeffs = [], player2Coeffs = [];
        let allFilled = true;

        for (let i = 5; i <= 10; i++) {
            const p1 = document.getElementById(`g${i}p1`);
            const p2 = document.getElementById(`g${i}p2`);
            if (p1.value.length === 4 && p2.value.length === 4) {
                player1Coeffs.push(parseFloat(p1.value));
                player2Coeffs.push(parseFloat(p2.value));
                p1.classList.remove('is-invalid');
                p2.classList.remove('is-invalid');
            } else {
                allFilled = false;
                if (p1.value.length !== 4) p1.classList.add('is-invalid');
                if (p2.value.length !== 4) p2.classList.add('is-invalid');
            }
        }

        if (!allFilled) {
            document.getElementById('error').textContent = 'Пожалуйста, заполните все коэффициенты в формате X.XX';
            document.getElementById('error').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            return;
        }

        document.getElementById('error').style.display = 'none';
        document.getElementById('error').textContent = '';

        const sumDecimalPlayer1 = player1Coeffs.reduce((sum, coeff) => sum + (coeff % 1), 0);
        const sumDecimalPlayer2 = player2Coeffs.reduce((sum, coeff) => sum + (coeff % 1), 0);

        let winner;
        if (sumDecimalPlayer1 < sumDecimalPlayer2) {
            winner = "Игрок 1";
        } else if (sumDecimalPlayer2 < sumDecimalPlayer1) {
            winner = "Игрок 2";
        } else {
            winner = "Ничья (суммы десятичных частей равны)";
        }

        document.getElementById('player1_sum').textContent = `Сумма десятичных частей (Игрок 1): ${sumDecimalPlayer1.toFixed(4)}`;
        document.getElementById('player2_sum').textContent = `Сумма десятичных частей (Игрок 2): ${sumDecimalPlayer2.toFixed(4)}`;
        document.getElementById('winner').textContent = `Победитель: ${winner}`;
        document.getElementById('result').style.display = 'block';
    }
});
