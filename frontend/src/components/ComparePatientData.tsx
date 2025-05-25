import React, { useEffect, useState } from 'react';
import style from '../styles/ComparePatientData.module.css';
import { MdArrowBack } from "react-icons/md";

type Method = 'deterministic' | 'mistral' | 'mixtral';

interface ComparePatientDataProps {
  cnp: string;
  goBack: () => void;
}

const methods: Method[] = ['deterministic', 'mistral', 'mixtral'];

const ComparePatientData: React.FC<ComparePatientDataProps> = ({ cnp, goBack }) => {
  const [data, setData] = useState<Record<Method, string>>({
    deterministic: '',
    mistral: '',
    mixtral: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all(
    methods.map(method =>
        fetch(`/files/${cnp}/${cnp}_${method}.txt`)
        .then(res => {
            if (!res.ok) {
            throw new Error(`Could not load ${cnp}_${method}.txt`);
            }
            return res.text();
        })
        .then(text => ({ method, text }))
    )
    )

      .then(results => {
        const map: any = {};
        results.forEach(({ method, text }) => map[method] = text);
        setData(map);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load parsed data.');
      })
      .finally(() => setLoading(false));
  }, [cnp]);

  if (loading) return <div>Loading comparison…</div>;
  if (error)   return <div className="text-danger">{error}</div>;

  return (
    <div>
      <MdArrowBack
        style={{height: '5vh', width: '5vw', overflow: 'auto'}}
        onClick={goBack}
      /> <br/>
      <h4 className="mb-4">Comparison for CNP: {cnp}</h4>
      <div className={style.container}>
        {methods.map(method => (
          <div key={method} className={style.column}>
            <h5 className="text-center text-capitalize">{method}</h5>
            <pre className={style.pre}>{data[method]}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePatientData;
