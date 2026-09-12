from abc import ABC, abstractmethod
from typing import List, Optional
from schemas.retrieval import PriorArtCandidate


class BasePatentConnector(ABC):
    """Abstract base connector for patent and literature databases."""
    
    @property
    @abstractmethod
    def source_name(self) -> str:
        """Name of the data source."""
        pass

    @abstractmethod
    def search(
        self,
        query: str,
        limit: int = 5,
        ipc_classes: Optional[List[str]] = None
    ) -> List[PriorArtCandidate]:
        """Search the data source for candidate prior art relevant to the query and classes."""
        pass
