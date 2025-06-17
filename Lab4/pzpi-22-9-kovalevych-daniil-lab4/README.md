# Лабораторна робота №4 — Масштабування бекенда

**Дисципліна:** Архітектура програмного забезпечення
**Студент:** Ковалевич Даніїл, ПЗПІ-22-9
**Тип масштабування:** Горизонтальне (через Kubernetes)

## Опис

У межах лабораторної роботи реалізовано горизонтальне масштабування серверної частини системи керування транспортними засобами. Роботу розгорнуто у локальному Kubernetes-кластері за допомогою Minikube. Для перевірки навантаження використано інструмент Locust.

## Технології

* Docker (контейнеризація Node.js серверу)
* Kubernetes (Minikube) — розгортання і масштабування
* SQLite — база даних, вбудована в кожен контейнер
* NodePort — Load Balancer через Kubernetes Service
* Locust — навантажувальне тестування API з авторизацією

## Структура проєкту

```
.
├── backend/                 # Node.js сервер з Dockerfile
├── k8s/                     # YAML-файли Kubernetes
│   ├── deployment.yaml
│   └── service.yaml
├── load-test/              # Тестовий сценарій Locust
│   └── locustfile.py
└── README.md               # Технічна документація
```

## Розгортання

1. Запуск Minikube:

```
minikube start --driver=docker
& minikube -p minikube docker-env | Invoke-Expression
```

2. Збірка образу у середовищі Minikube:

```
cd backend
docker build -t backend-lab4 .
```

3. Розгортання:

```
cd ../k8s
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

4. Перевірка:

```
kubectl get pods
minikube service backend-service
```

## Locust — тестування продуктивності

### Авторизація + запити:

1. POST /login — отримання JWT токену
2. GET /vehicles — запит з токеном у заголовку Authorization

### Приклад запуску:

```
cd load-test
locust -f locustfile.py
```

У браузері: [http://localhost:8089](http://localhost:8089)

* Host: http\://<minikube-ip>:30080
* Users: 30
* Spawn rate: 5

## Результати

* Запити в секунду: \~21
* Середня затримка: \~18.8 мс
* Кількість користувачів: 30
* Відмов: 0%

## Висновок

Під час навантажувального тестування система показала стабільну роботу при горизонтальному масштабуванні. Результати демонструють, що зі збільшенням кількості реплік (Pod-ів) кількість оброблених запитів зростає. Масштабування через Kubernetes є ефективним рішенням для покращення продуктивності бекенда.
