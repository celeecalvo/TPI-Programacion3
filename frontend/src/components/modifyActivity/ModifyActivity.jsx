import React, {useState, useEffect, useContext} from 'react'
import { useNavigate, useParams } from 'react-router';
import { useFetch } from '../hook/UseFetch.js';
import ActivityForm from '../activityForm/ActivityForm';

import { AuthenticationContext } from '../services/auth.context';

const ModifyActivity = () => {
  const { put, getById } = useFetch("/activities");
  const { token } = useContext(AuthenticationContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      const activity = await getById(id, token);
      setActivityData(activity);
    };
    fetchActivity();
  }, [id]);

  const handleClickEdit = async (data) => {
    const updated = await put(data, id, token);
    navigate('/joined-clubs');
  };

  if (!activityData) return <p className='dark'>Cargando datos de la actividad...</p>

  return <ActivityForm mode="edit" initialData={activityData} onSubmit={handleClickEdit} />
}

export default ModifyActivity