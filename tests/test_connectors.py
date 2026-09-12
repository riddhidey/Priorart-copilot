from connectors.mock_index import MockPatentIndexConnector
from connectors.semantic_scholar import SemanticScholarConnector
from connectors.google_patents import GooglePatentsConnector


def test_mock_patent_index_connector():
    connector = MockPatentIndexConnector()
    results = connector.search(query="variable pitch propeller rotor", limit=3)
    assert len(results) > 0
    assert any("US-10457388-B2" in doc.doc_id for doc in results)
    assert results[0].source == "mock_patent_index"


def test_mock_patent_index_electronics():
    connector = MockPatentIndexConnector()
    results = connector.search(query="wake up sub threshold comparator", limit=3)
    assert len(results) > 0
    assert any("US-10892745-B1" in doc.doc_id for doc in results)


def test_connector_interface_handles_unknown_query():
    connector = MockPatentIndexConnector()
    results = connector.search(query="xyzrandomnonexistentquery123", limit=5)
    assert isinstance(results, list)
