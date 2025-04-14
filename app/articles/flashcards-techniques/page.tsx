'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Brain, Clock, BarChart, Tag, Share2 } from 'lucide-react';

function FlashcardsArticleContent() {
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
              src="/images/articles/flashcards-techniques.jpg"
              alt="Tecniche Avanzate di Studio con Flashcard"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Metodi di Studio
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                  Memorizzazione
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tecniche Avanzate di Studio con Flashcard
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <span className="mr-4">10 Maggio 2023</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  5 minuti di lettura
                </span>
              </div>
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <p className="lead text-xl text-gray-700 dark:text-gray-300 mb-6">
                Le flashcard sono uno strumento potente per la memorizzazione a lungo termine, ma il loro vero potenziale si sblocca quando vengono utilizzate con metodi scientifici di ripetizione spaziata. Scopriamo come ottimizzare il tuo studio.
              </p>

              <h2>Cos'è la Ripetizione Spaziata?</h2>
              <p>
                La <strong>ripetizione spaziata</strong> è una tecnica di apprendimento che prevede di rivedere le informazioni a intervalli crescenti nel tempo. Invece di studiare intensamente tutto in una volta (cramming), la ripetizione spaziata distribuisce lo studio in più sessioni distanziate tra loro.
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg my-6">
                <div className="flex items-start">
                  <Brain className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Il Principio Scientifico</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      La ripetizione spaziata sfrutta la <em>curva dell'oblio</em> di Ebbinghaus: tendiamo a dimenticare rapidamente le informazioni appena apprese, ma ogni ripasso successivo rallenta il tasso di dimenticanza.
                    </p>
                  </div>
                </div>
              </div>

              <h2>Come Creare Flashcard Efficaci</h2>
              <p>
                Non tutte le flashcard sono create allo stesso modo. Ecco alcuni principi per creare flashcard che massimizzano la memorizzazione:
              </p>

              <ol>
                <li>
                  <strong>Il principio della domanda atomica</strong> - Ogni flashcard dovrebbe testare un solo concetto o fatto. Evita di sovraccaricare una carta con troppe informazioni.
                </li>
                <li>
                  <strong>Usa il principio di minima informazione</strong> - Includi solo le informazioni essenziali necessarie per rispondere alla domanda.
                </li>
                <li>
                  <strong>Formulazione attiva</strong> - Scrivi le domande in modo da attivare il pensiero, non solo il riconoscimento passivo. Usa "perché", "come", "spiega".
                </li>
                <li>
                  <strong>Connessioni significative</strong> - Collega nuove informazioni a ciò che già conosci per creare una rete di conoscenze interconnesse.
                </li>
              </ol>

              <h2>Strategie di Utilizzo delle Flashcard</h2>

              <h3>Il Sistema Leitner</h3>
              <p>
                Il sistema Leitner organizza le flashcard in gruppi o "box" in base alla facilità con cui le ricordi:
              </p>
              <ul>
                <li>Box 1: Carte che trovi difficili - ripeti ogni giorno</li>
                <li>Box 2: Carte di media difficoltà - ripeti ogni 3 giorni</li>
                <li>Box 3: Carte facili - ripeti ogni settimana</li>
                <li>Box 4: Carte molto facili - ripeti ogni mese</li>
              </ul>
              <p>
                Quando rispondi correttamente a una carta, la promuovi al box successivo. Se sbagli, la carta torna al Box 1.
              </p>

              <div className="my-8 overflow-hidden rounded-lg shadow-md">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Algoritmo</th>
                      <th className="px-4 py-3 text-left">Pro</th>
                      <th className="px-4 py-3 text-left">Contro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 font-medium">Sistema Leitner</td>
                      <td className="px-4 py-3">Semplice e intuitivo, implementabile anche con carte fisiche</td>
                      <td className="px-4 py-3">Meno preciso di algoritmi digitali avanzati</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800/80">
                      <td className="px-4 py-3 font-medium">SuperMemo (SM-2)</td>
                      <td className="px-4 py-3">Altamente efficiente, algoritmo basato su ricerca scientifica</td>
                      <td className="px-4 py-3">Richiede software specifico, più complesso</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 font-medium">Anki</td>
                      <td className="px-4 py-3">Implementazione open source, versatile e personalizzabile</td>
                      <td className="px-4 py-3">Curva di apprendimento per la personalizzazione</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Integrazione con la Tecnica Pomodoro</h3>
              <p>
                Combinare le flashcard con la tecnica del pomodoro può aumentarne l'efficacia:
              </p>
              <ul>
                <li>Dedica sessioni di 25 minuti (un pomodoro) alla ripetizione delle flashcard</li>
                <li>Fai una pausa di 5 minuti</li>
                <li>Ogni 4 pomodori, fai una pausa più lunga di 15-30 minuti</li>
                <li>Questa combinazione mantiene alta la concentrazione e previene l'affaticamento mentale</li>
              </ul>

              <h2>Applicazione della Ripetizione Spaziata in AppScuola</h2>
              <p>
                La nostra app implementa un algoritmo di ripetizione spaziata basato su SM-2, che:
              </p>
              <ul>
                <li>Calcola automaticamente quando mostrarti ogni flashcard in base alle tue performance precedenti</li>
                <li>Adatta gli intervalli in base alla facilità con cui ricordi ciascuna carta</li>
                <li>Ti permette di concentrarti sulle carte più difficili senza trascurare quelle che conosci bene</li>
                <li>Fornisce statistiche sul tuo apprendimento per ottimizzare ulteriormente lo studio</li>
              </ul>

              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Prova la Ripetizione Spaziata</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Esplora la nostra funzionalità di flashcard con ripetizione spaziata integrata nella dashboard di AppScuola.
                </p>
                <Link 
                  href="/dashboard/flashcards"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  Vai alla sezione Flashcard
                  <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                </Link>
              </div>

              <h2>Conclusione</h2>
              <p>
                Le flashcard, quando utilizzate con tecniche di ripetizione spaziata e principi di design efficaci, sono uno degli strumenti più potenti per la memorizzazione a lungo termine. Non si tratta solo di quante ore studi, ma di come distribuisci queste ore nel tempo.
              </p>
              <p>
                Inizia con poche carte (5-10 al giorno) e costruisci gradualmente la tua collezione. La costanza è più importante del volume: meglio rivedere 10 carte ogni giorno che 70 una volta alla settimana.
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
                    flashcard
                  </span>
                  <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    studio
                  </span>
                  <span className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    memoria
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
              href="/articles/pwa-education"
              className="group flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <Image
                  src="/images/articles/pwa-education.jpg"
                  alt="PWA nell'Educazione"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  PWA nell'Educazione
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Come le Progressive Web App stanno trasformando l'accesso alle risorse educative.
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

export default function FlashcardsArticlePage() {
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <FlashcardsArticleContent />
    </Suspense>
  );
} 