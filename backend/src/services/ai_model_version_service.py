"""
AI Model Version Service - Business Logic Layer
Handles AI model version management
"""

from typing import List, Optional
from datetime import datetime
from domain.models.ai_model_version import AiModelVersion
from domain.models.iai_model_version_repository import IAiModelVersionRepository


class AiModelVersionService:
    def __init__(self, repository: IAiModelVersionRepository):
        self.repository = repository
    
    def create_model_version(self, model_name: str, version: str,
                             threshold_config: str,
                             trained_at: Optional[datetime] = None,
                             active_flag: bool = False) -> Optional[AiModelVersion]:
        """Create AI model version"""
        return self.repository.add(
            model_name=model_name,
            version=version,
            threshold_config=threshold_config,
            trained_at=trained_at or datetime.now(),
            active_flag=active_flag
        )
    
    def get_model_by_id(self, ai_model_version_id: int) -> Optional[AiModelVersion]:
        """Get model by ID"""
        return self.repository.get_by_id(ai_model_version_id)
    
    def get_active_model(self) -> Optional[AiModelVersion]:
        """Get currently active model"""
        return self.repository.get_active_model()
    
    def get_model_by_version(self, version: str) -> Optional[AiModelVersion]:
        """Get model by version"""
        return self.repository.get_by_version(version)
    
    def list_all_models(self) -> List[AiModelVersion]:
        """Get all model versions"""
        return self.repository.get_all()
    
    # Backwards-compatible alias for controller
    def get_all_models(self) -> List[AiModelVersion]:
        """Alias used by controller: get all model versions"""
        return self.list_all_models()
    
    def set_active_model(self, ai_model_version_id: int) -> Optional[AiModelVersion]:
        """Set model as active (deactivates other models)"""
        return self.repository.set_active(ai_model_version_id)
    
    # Alias used by controller
    def activate_model(self, ai_model_version_id: int) -> Optional[AiModelVersion]:
        """Activate model version (deactivates others)."""
        return self.set_active_model(ai_model_version_id)
    
    def deactivate_model(self, ai_model_version_id: int) -> Optional[AiModelVersion]:
        """Deactivate model version (set active_flag=False)."""
        return self.update_model(ai_model_version_id, active_flag=False)
    
    def update_model(self, ai_model_version_id: int, **kwargs) -> Optional[AiModelVersion]:
        """Update model version"""
        return self.repository.update(ai_model_version_id, **kwargs)
    
    def delete_model(self, ai_model_version_id: int) -> bool:
        """Delete model version"""
        model = self.repository.get_by_id(ai_model_version_id)
        if model and model.active_flag:
            raise ValueError("Cannot delete active model. Set another model as active first.")
        return self.repository.delete(ai_model_version_id)
    
    def count_models(self) -> int:
        """Count total model versions (legacy name)."""
        return self.repository.count()
    
    # --- Additional helpers used by controller / analytics ---
    
    def get_models_by_name(self, model_name: str) -> List[AiModelVersion]:
        """Get all versions of a given model_name."""
        all_models = self.repository.get_all()
        return [m for m in all_models if m.model_name == model_name]
    
    def get_active_models(self) -> List[AiModelVersion]:
        """
        Get all active models.
        Current DB schema cho phép nhiều active_flag=True,
        nhưng UI chủ yếu dùng 0 hoặc 1 bản ghi.
        """
        all_models = self.repository.get_all()
        return [m for m in all_models if getattr(m, 'active_flag', False)]
    
    def get_latest_version_active(self, model_name: Optional[str] = None) -> Optional[AiModelVersion]:
        """
        Get latest active model (optionally filtered by model_name).
        Ưu tiên trained_at mới nhất, fallback theo id.
        """
        active_models = self.get_active_models()
        if model_name:
            active_models = [m for m in active_models if m.model_name == model_name]
        if not active_models:
            return None
        # sort by trained_at desc, then id desc
        def sort_key(m: AiModelVersion):
            return (
                m.trained_at or datetime.min,
                getattr(m, 'ai_model_version_id', 0)
            )
        return sorted(active_models, key=sort_key, reverse=True)[0]
    
    def update_model_threshold_config(self, ai_model_version_id: int, threshold_config: str) -> Optional[AiModelVersion]:
        """Update only threshold_config field for model."""
        return self.update_model(ai_model_version_id, threshold_config=threshold_config)
    
    def count_models_total(self) -> int:
        """Total models in system (used by stats endpoint)."""
        return self.repository.count()
    
    def count_models_active(self) -> int:
        """Number of active models."""
        return len(self.get_active_models())
