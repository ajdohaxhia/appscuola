'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Download, Tag, Share2, Smartphone, Wifi, Zap, Clock } from 'lucide-react';

export default function PwaEducationArticlePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-primary hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Torna agli articoli
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="relative h-72 w-full">
            <Image
              src="/images/articles/pwa-education.jpg"
              alt="PWA nell'Educazione"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Tecnologia Educativa
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                  Web App
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                PWA nell'Educazione: Accessibilità e Innovazione
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <span className="mr-4">15 Maggio 2023</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  7 minuti di lettura
                </span>
              </div>
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <p className="lead text-xl text-gray-700 dark:text-gray-300 mb-6">
                Le Progressive Web App (PWA) stanno trasformando il modo in cui gli studenti accedono alle risorse educative, superando le barriere tradizionali tra app native e siti web. Scopri come queste tecnologie stanno democratizzando l'accesso all'educazione digitale.
              </p>

              <h2>Cosa sono le Progressive Web App?</h2>
              <p>
                Le Progressive Web App rappresentano un'evoluzione delle tradizionali applicazioni web, combinando le migliori caratteristiche del web e delle app native. Sviluppate seguendo specifici standard tecnici, le PWA offrono un'esperienza utente simile a quella delle app native, ma con la portabilità e l'accessibilità del web.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Smartphone className="h-10 w-10 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">Installabilità</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Possono essere installate sulla schermata home dei dispositivi senza passare attraverso gli app store.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Wifi className="h-10 w-10 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">Offline</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Funzionano anche senza connessione internet, garantendo l'accesso ai contenuti didattici in qualsiasi momento.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Zap className="h-10 w-10 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">Prestazioni</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Offrono caricamenti rapidi e interazioni fluide, migliorando l'esperienza di apprendimento.
                  </p>
                </div>
              </div>

              <h2>Il Divario Digitale nell'Educazione</h2>
              <p>
                Nonostante i progressi tecnologici, esistono ancora significative disuguaglianze nell'accesso agli strumenti digitali educativi. Questo divario ha cause multiple:
              </p>

              <ul>
                <li>
                  <strong>Limitazioni hardware</strong> - Molti studenti hanno accesso solo a dispositivi più vecchi o meno potenti.
                </li>
                <li>
                  <strong>Connettività irregolare</strong> - L'accesso a internet non è garantito in tutte le aree geografiche e ambienti.
                </li>
                <li>
                  <strong>Costi proibitivi</strong> - Le app native richiedono spesso dispositivi aggiornati e possono occupare spazio di archiviazione significativo.
                </li>
                <li>
                  <strong>Frammentazione delle piattaforme</strong> - La necessità di sviluppare app separate per iOS, Android e altri sistemi aumenta i costi e limita l'accessibilità.
                </li>
              </ul>

              <h2>Come le PWA Democratizzano l'Educazione Digitale</h2>
              
              <h3>Funzionamento Offline</h3>
              <p>
                Una delle caratteristiche più rivoluzionarie delle PWA è la capacità di funzionare offline attraverso i Service Workers. Questa tecnologia permette di:
              </p>
              <ul>
                <li>Memorizzare nella cache le risorse essenziali durante la prima visita</li>
                <li>Garantire l'accesso ai contenuti didattici anche in assenza di connessione</li>
                <li>Sincronizzare automaticamente i dati quando la connessione viene ripristinata</li>
              </ul>
              <p>
                Per gli studenti in aree con connettività limitata o instabile, questa funzionalità è trasformativa, eliminando le interruzioni nell'apprendimento dovute a problemi di rete.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg my-8">
                <h3 className="font-bold text-xl mb-3">Case Study: Khan Academy Lite</h3>
                <p className="mb-4">
                  Khan Academy ha implementato una versione "Lite" della propria piattaforma come PWA, riducendo drasticamente i requisiti di connettività e hardware. Questa iniziativa ha permesso di portare risorse educative di alta qualità in regioni remote del mondo con infrastrutture limitate.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                  "Abbiamo visto un aumento del 65% nell'engagement degli studenti nelle aree rurali dopo l'adozione della PWA, con tempi di studio settimanali aumentati da 2 a 5,3 ore per studente."
                </p>
              </div>

              <h3>Accessibilità Cross-Platform</h3>
              <p>
                Le PWA funzionano su qualsiasi dispositivo con un browser moderno, eliminando le barriere d'accesso legate al sistema operativo. Questa caratteristica:
              </p>
              <ul>
                <li>Permette agli studenti di utilizzare qualsiasi dispositivo abbiano a disposizione</li>
                <li>Riduce significativamente i costi di sviluppo per le istituzioni educative</li>
                <li>Garantisce un'esperienza coerente tra desktop, tablet e smartphone</li>
              </ul>

              <h3>Riduzione del Carico Cognitivo</h3>
              <p>
                Un aspetto spesso trascurato dell'accessibilità è il carico cognitivo richiesto per utilizzare un'applicazione. Le PWA ben progettate offrono:
              </p>
              <ul>
                <li>Interfacce intuitive e coerenti</li>
                <li>Tempi di caricamento rapidi che mantengono alta l'attenzione</li>
                <li>Funzionalità progressive che si adattano alle diverse capacità degli utenti</li>
              </ul>
              <p>
                Questi fattori sono particolarmente importanti per gli studenti con difficoltà di apprendimento o disturbi dell'attenzione.
              </p>

              <h2>AppScuola: Un Esempio di PWA Educativa</h2>
              <p>
                La nostra applicazione, AppScuola, è stata progettata come PWA proprio per affrontare queste sfide di accessibilità. I vantaggi includono:
              </p>
              
              <div className="my-8 overflow-hidden rounded-lg shadow-md">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Funzionalità</th>
                      <th className="px-4 py-3 text-left">Beneficio Educativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 font-medium">Modalità offline per flashcard e appunti</td>
                      <td className="px-4 py-3">Permette lo studio continuo in qualsiasi contesto</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800/80">
                      <td className="px-4 py-3 font-medium">Sincronizzazione intelligente</td>
                      <td className="px-4 py-3">Salva automaticamente i progressi quando torna online</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 font-medium">Design responsive</td>
                      <td className="px-4 py-3">Ottimizzato per qualsiasi dimensione di schermo</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800/80">
                      <td className="px-4 py-3 font-medium">Installabilità semplificata</td>
                      <td className="px-4 py-3">Veloce accesso direttamente dalla schermata home</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Prova AppScuola come PWA</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Installa AppScuola sul tuo dispositivo per sperimentare i vantaggi di una PWA educativa.
                </p>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Installa AppScuola
                </button>
              </div>

              <h2>Il Futuro dell'Educazione Digitale</h2>
              <p>
                Le PWA stanno aprendo nuove frontiere per l'educazione digitale, ma il loro pieno potenziale deve ancora essere realizzato. I prossimi sviluppi potrebbero includere:
              </p>
              <ul>
                <li>Integrazione più profonda con le API dei dispositivi per esperienze AR/VR educative</li>
                <li>Sistemi di apprendimento adattivo che funzionano anche offline</li>
                <li>Collaborazione in tempo reale con sincronizzazione intelligente quando offline</li>
                <li>Accessibilità migliorata per studenti con disabilità attraverso API avanzate</li>
              </ul>

              <h2>Conclusione</h2>
              <p>
                Le Progressive Web App rappresentano un ponte cruciale verso un'educazione digitale più equa e accessibile. Riducendo le barriere tecniche ed economiche, le PWA permettono a un numero maggiore di studenti di accedere a strumenti educativi di qualità, indipendentemente dal loro contesto socioeconomico o geografico.
              </p>
              <p>
                Per educatori, sviluppatori e istituzioni, le PWA offrono una soluzione economicamente efficiente che massimizza la portata e l'impatto delle risorse educative. In un mondo sempre più digitale, ma ancora caratterizzato da profonde disuguaglianze nell'accesso alla tecnologia, le PWA possono essere un potente strumento di democratizzazione dell'educazione.
              </p>
            </div>

            <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Condividi:</span>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    pwa
                  </span>
                  <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    tecnologia
                  </span>
                  <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    accessibilità
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </article>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Articoli correlati
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/articles/flashcards-techniques"
              className="group flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <Image
                  src="/images/articles/flashcards-techniques.jpg"
                  alt="Tecniche Avanzate di Studio con Flashcard"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  Tecniche Avanzate di Studio con Flashcard
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Strategie efficaci per ottimizzare l'apprendimento con le flashcard e la ripetizione spaziata.
                </p>
              </div>
            </Link>
            <Link 
              href="/articles/ar-learning"
              className="group flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <Image
                  src="/images/articles/ar-learning.jpg"
                  alt="Realtà Aumentata nell'Educazione"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  Realtà Aumentata nell'Educazione
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Esplora come la realtà aumentata sta rivoluzionando l'apprendimento attraverso esperienze immersive.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 