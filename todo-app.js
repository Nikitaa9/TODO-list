(function() {
  let newTasks;
  let saveCase = [];
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
      let appTitle = document.createElement('h2');
      appTitle.innerHTML = title;
      return appTitle; // возвращать нужно обязательно!
  };

  // создаем и возвращаем форму при создании дела
  function createTodoItemForm() {
      let form = document.createElement('form');
      let input = document.createElement('input');
      let buttonWrapper = document.createElement('div');
      let button = document.createElement('button');

      form.classList.add('input-group', 'mb-3');
      input.classList.add('form-control');
      input.placeholder = 'Введите событие';
      buttonWrapper.classList.add('input-group-append');
      button.classList.add('btn', 'btn-primary');
      button.setAttribute('disabled', '');
      button.textContent = 'Добавить событие';

      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);

      return {
          form,
          input,
          button,
      };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list;
  }

  // создаем рандомное число и возвращаем его как id для нового дела
  function createId() {
    id = Math.round(Math.random() * 10000);
    return id;
  }

  function createTodoItem(name, done = false, id) {
      let item = document.createElement('li');
      //кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement('div');
      let doneButton = document.createElement('button');
      let deleteButton = document.createElement('button');
      // при создании дела, создается объект
      newTasks = {
        id: id || createId(),
        name,
        done,
      }

      // присваиваем уникальный id элементу списка и кнопкам в нем
      item.setAttribute('id', newTasks.id);
      doneButton.setAttribute('id', newTasks.id);
      deleteButton.setAttribute('id', newTasks.id);

      // пушим созданный объект в массив saveCase
      saveCase.push(newTasks);

      // устанавливаем стили для элемента списка, а также для размещения кнопок
      // в его правой части с помощью flex
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      item.textContent = name; // textContent так как, могут вписываться <> - нельзя их воспринять как тэг

      buttonGroup.classList.add('btn-group', 'btn-group-sm');
      doneButton.classList.add('btn', 'btn-success');
      doneButton.textContent = 'Готово';
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Удалить';

      // вкладываем кнопки в отдельный элемент
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);

      // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
      return {
          item,
          doneButton,
          deleteButton,
      }
  };

  function createTodoApp(container, title, listName) {
    let todoAppTitle = createAppTitle(title); // возвращают DOM элемент который можно разместить
    let todoItemForm = createTodoItemForm(); // вернет объект в котором помимо прочего есть формы
    let todoList = createTodoList(); //  возвращают DOM элемент который можно разместить

    container.append(todoAppTitle);
    container.append(todoItemForm.form); // поэтому сначала берем его форму
    container.append(todoList);

    // создаем событие на ввод текста в поле и разблокировку кнопки Добавить событие
    todoItemForm.input.addEventListener('input', function() {
      // если введен текст, то удаляем атрибут disabled
      if(todoItemForm.input.value) {
        todoItemForm.button.removeAttribute('disabled');
      }
      // если поле ввода активно, но ничего не введено, то добавляем атрибут disabled
      if(todoItemForm.input.value.length === 0) {
        todoItemForm.button.setAttribute('disabled','');
      }
    });

    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(event) {
      // перезаписываем значение в localStorage
      localStorage.setItem(listName, JSON.stringify(saveCase));
      // после нажатия на Добавить событие, блокируем эту кнопку до ввода нового текста
      todoItemForm.button.setAttribute('disabled','');
       // выводим в консоль все элементы масси
      // эта строчка необходима,  чтобы предотвратить стандратные действия браузера
      // в данном случае мы не хотим, чтобы страница перезагрузилась при отправке формы
      event.preventDefault();
      // игнорируем создание элемента, если пользоваель ничего не ввел в поле
      if (!todoItemForm.input.value) {
          return;
        }
        let todoItem = createTodoItem(todoItemForm.input.value);
        // добавляем обработчики на кнопки
        todoItem.doneButton.addEventListener('click', function() {
          todoItem.item.classList.toggle('list-group-item-success'); // зеленая подсветка кнопки при нажатии вкл/выкл
          // нажатие создает переменную с айди кнопки на которую нажали
          const id = Number(todoItem.doneButton.getAttribute('id'));
          // далее находим данный элемент в массиве saveCase и изменяем значение done на true или false
          saveCase.forEach(function (i) {
            if (i.id === id) {
              i.done =!i.done;
            }
          });
          // перезаписываем значение в localStorage
          localStorage.setItem(listName, JSON.stringify(saveCase));
        });

        todoItem.deleteButton.addEventListener('click', function() {
          // нажатие создает переменную с айди кнопки на которую нажали
          const id = Number(todoItem.deleteButton.getAttribute('id'));
          if (confirm('Вы уверены?')) { // если ответ да то удаляем элемент
            todoItem.item.remove();
            // находим данный элемент в массиве saveCase и удаляем его
            saveCase.forEach(function (i) {
              if (i.id === id) {
                saveCase.splice(saveCase.indexOf(i), 1)
              }
            });
          }
          // перезаписываем значение в localStorage
          localStorage.setItem(listName, JSON.stringify(saveCase));
        });

        // создаем и добавляем в список новое дело с названием из поля для ввода
        todoList.append(todoItem.item);
        // обнуляем значение в поле ввода
        todoItemForm.input.value = '';
      });
    };

    function loadingApp(listName) {
      // объявляем переменную со значением данных из localStorage
      let saveCase = JSON.parse(localStorage.getItem(listName))

      // если значение storage не ноль, то передаем его значение в переменную saveCase
      if(saveCase) {
        console.log(saveCase[0]);
        createTodoList();
        saveCase.forEach((obj) => createTodoItem(obj.name, obj.done, obj.id));
      }
    }

  // использовать данный код, в случае, если мы хотим все это увидеть на одной странице
  // document.addEventListener('DOMContentLoaded', function() {
  //     createTodoApp(document.getElementById('my-todos'), 'Мои дела');
  //     createTodoApp(document.getElementById('mom-todos'), 'Мои задачи');
  //     createTodoApp(document.getElementById('dad-todos'), 'Мои поручения');
  // });

  window.loadingApp = loadingApp;
  window.createTodoApp = createTodoApp; // создаем метод для того, чтобы использовать функцию с любого скрипта

})()
