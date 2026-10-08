import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function RenameModal({ isOpen, onClose, item, onRename }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setError('');
    }
  }, [isOpen, item]);

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (name.trim() === item?.name) {
      handleClose();
      return;
    }

    setLoading(true);
    const success = await onRename(item, name.trim());
    setLoading(false);

    if (success) handleClose();
  };

  const isFolder = item?.is_folder || item?.type === 'folder';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Rename ${isFolder ? 'Folder' : 'File'}`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          autoFocus
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Rename
          </Button>
        </div>
      </form>
    </Modal>
  );
}
