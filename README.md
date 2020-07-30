# Farma krava
Veb aplikacija koja predstavlja implementaciju dela informacionog sistema farme krava.

## Opis
Aplikacija je kreirana u okviru predmeta Fizičko projektovanje informacionog sistema na katedri za informaciono inženjerstvo na Fakultetu organizacionih nauka u Beogradu.<br/><br/>
Implementaciji je prethodila detaljna analiza i projektovanje informacionog sistema za konkretnu farmu rađena na drugom predmetu.

## Implementacija
Delovi sistema obuhvaćeni ovom aplikacijom jesu kreiranje i ažuriranje prijemnice za krave i obrada godišnjeg finansijskog izveštaja.<br/><br/>
**Frontend:** React framework uz korišćenje biblioteke "material-ui" za dizajniranje elemenata korisničkog interfejsa.<br/><br/>
**Backend:** API napisan u Node JS-u sa Express bibliotekom. <br/>Urađena je i simulacija raspoređivanja tereta (load balancing) korišćenjem heš funkcija nad identifikatorom korisničkog zahteva (request-id) u slučaju postojanja više paralelnih servera.<br/><br/>
Za skladište podataka korišćena je NoSQL baza podataka, konkretno MongoDB sa kojom je API komunicirao uz pomoć "mongoose" biblioteke.


## Korišćene tehnologije
<ul>
  <li>Visual Studio Code</li>
  <li>MongoDB Atlas</li>
  <li>React.js</li>
  <li>Node.js & Express</li>  
</ul>

## Dodatno
Slike aplikacije možete pogledati [ovde](Slike_aplikacije/).
