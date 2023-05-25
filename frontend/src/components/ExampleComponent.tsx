import { useEffect, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

const ExampleComponent = () => {

    const isTextItem = (item: any): item is { str: string } => {
        return item.str !== undefined;
    };

    const [text, setText] = useState("cevaaaa");

    useEffect(() => {
        const fetchDataFromPDF = async () => {
            GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;
            
            const url = './BILET_IESIRE';
            const pdf = await getDocument(url).promise;
            
            const page = await pdf.getPage(1);
            
            const content = await page.getTextContent();

            const text = content.items.map(item => isTextItem(item) ? 
                item.str : "").join(' ');
            
            setText(text);
            console.log(text);
        }

        fetchDataFromPDF();
    }, []);

    return (
        <> 
            <p>Example Component</p>
            <p>{text}</p>
        </>
    );
}

export default ExampleComponent;