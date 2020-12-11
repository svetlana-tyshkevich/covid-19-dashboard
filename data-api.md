https://restcountries.eu/rest/v2/all?fields=name;population;flag - **флаг и кол-во жителей**
https://www.countryflags.io/ - **только флаги**
https://documenter.getpostman.com/view/10808728/SzS8rjbc


	# I - Данные

## Таблица 1 (всего 12(пк) показателей).

 * **По умолчанию** -- для мира в целом.  
GET Live By Country All Status
https://api.covid19api.com/live/country/south-africa
--- GET World Total -  https://api.covid19api.com/world/total 
 * **По выбору** - страна.  --- GET Countries (https://api.covid19api.com/countries )
GET Live By Country And Status - https://api.covid19api.com/live/country/south-

africa/status/confirmed 

------
------**Выбор страны:** 
	а) кликом из списка  --- GET Countries (https://api.covid19api.com/countries ) 
	б) кликом по карте
	в) через поиск 					
------
**Вкладки(Переключатели)** - (4шт.)
 * __1__ х3(пк)весь период  --- GET Summary (https://api.covid19api.com/summary )
	Day One (https://api.covid19api.com/dayone/country/south-africa/status/confirmed )

 * __2__ х3(пк)Последний день (как в API) --- GET Summary (https://api.covid19api.com/summary )
 * __3__ х3(пк).абсолютная величина - **(то же что  и __1__ ???)**
 * __4__ х3(пк).На 100тыс — (https://www.countryflags.io/) - население(кол-во) и флаги

в каждом(й) отображается - 
 * (1)-заболевшие 
 * (2)-летальные исходы
 * (3)-выздоровевшие
---API – значения - (confirmed(1), recovered(3), deaths(2))

**DayOne**      - https://api.covid19api.com/dayone/country/south-africa/status/confirmed  - по 
отдельности с первого дня ведения статистики(confirmed(1), recovered(3), deaths(2))
**DayOneAll** - https://api.covid19api.com/dayone/country/south-africa  - - все случаи с первого 
дня...
**DayOneLive** -  https://api.covid19api.com/dayone/country/south-africa/status/confirmed/live  - 
в Live режиме с первоо дня?


## Таблица 2  
 * Список стран(сортировка по убыванию по выбранному показателю.)  - 
https://restcountries.eu/rest/v2/all?fields=name;population;flag

--**По умолчанию** --общее количество за весь период  - 
**DayOneAll** - https://api.covid19api.com/dayone/country/south-africa  - - все случаи с первого 
дня...
--**По выбору** - любой другой показатель из таблицы(1?).

 *   Поиск по названию страны.(Поиск работает "на лету": по мере ввода соответствующие введённым 
символам результаты.)

	--Результат поиска можно выбрать кликом, даже если поисковый запрос ещё не был введён 
полностью. 
	--Возле каждой страны выводится изображение её флага.  -- 
**только флаги** – (https://www.countryflags.io/)
**флаг и население** - (https://restcountries.eu/rest/v2/all?fields=name;population;flag)



## 3. Карта.

указывается
 *  $$интенсивность распространения в разных странах:
 -цветом или 
 -размером маркера

--**По умолчанию** $$интенсивность по общему количеству заболевания за весь период.

--**Можно выбрать** любой &&(другой показатель) из отображающихся в таблице.

 *  интерактивность
	- есть возможность перетаскивать карту,
	- уменьшать и увеличивать масштаб.
	- при наведении курсора на страну всплывающая подсказка - название и показатель(который в 
данный момент используется для определения $$интенсивности распространения болезни.) 

 *  У карты есть легенда
	-- Для оформления карты используется кастомный дизайн.


## 4.  График.

 * **По умолчанию** строится по общему количеству случаев заболевания. 
 * При наведении курсора на график **всплывающая подсказка** с датой, и данными по этой дате.
**GET World WIP** --https://api.covid19api.com/world?from=2020-03-01T00:00:00Z&to=2020-04-
01T00:00:00Z
_all live cases after a given date. Cases must be one of: confirmed, recovered, deaths_

 
 * У пользователя есть возможность просмотреть график **по любому из выбранных показателей **
из тех, которые выводятся *в таблице 1*, 
	--для мира в целом - GET World WIP
https://api.covid19api.com/world?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z

	--для любой выбранной страны. - GET Live By Country And Status After Date
https://api.covid19api.com/live/country/south-africa/status/confirmed/date/2020-03-21T13:13:30Z


# II - API

POST Webhook
https://api.covid19api.com/webhook
 - Adds a webhook to be notified of when **new daily data** is retrieved. The body of the webhook 
is the same as the response from /summary.
